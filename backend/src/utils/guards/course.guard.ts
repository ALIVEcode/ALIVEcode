import { Injectable, ExecutionContext, Inject, CanActivate, HttpException, HttpStatus } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { hasRole } from '../../models/user/auth';
import { Role } from '../types/roles.types';
import { MyRequest } from './auth.guard';
import { CourseService } from '../../models/course/course.service';
import { StudentEntity } from '../../models/user/entities/user.entity';
import { UserService } from '../../models/user/user.service';
import { COURSE_ACCESS } from '../../models/course/entities/course.entity';

@Injectable()
export class CourseAccess implements CanActivate {
  constructor(
    public courseService: CourseService,
    public userService: UserService,
    @Inject(REQUEST) public req: MyRequest,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.req.course != null) return true;

    const courseId = this.req.params.id;
    if (!courseId) throw new HttpException('Bad payload', HttpStatus.BAD_REQUEST);

    const user = this.req.user;
    if (!user) throw new HttpException('Not Authenticated', HttpStatus.UNAUTHORIZED);

    const course = await this.courseService.findOne(courseId);

    // If user is staff, give access
    if (hasRole(user, Role.STAFF)) {
      this.req.course = course;
      return true;
    }

    // If user is creator, give access
    if (course.creator.id === user.id) {
      this.req.course = course;
      return true;
    }

    // If course is private, deny access
    if (course.access === COURSE_ACCESS.PRIVATE) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    // If course is public or unlisted, accept access
    if (course.access === COURSE_ACCESS.PUBLIC || course.access === COURSE_ACCESS.UNLISTED) {
      this.req.course = course;
      return true;
    }

    // Otherwise, the course is restricted. So only students inside a class containing the course can enter
    if (user instanceof StudentEntity) {
      const courses = await this.userService.getCourses(user);
      if (!courses.some(c => c.id === course.id)) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      this.req.course = course;
      return true;
    }

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}

@Injectable()
export class CourseProfessor implements CanActivate {
  constructor(
    public courseService: CourseService,
    public userService: UserService,
    @Inject(REQUEST) public req: MyRequest,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.req.course != null) return true;

    const courseId = this.req.params.id;
    if (!courseId) throw new HttpException('Bad payload', HttpStatus.BAD_REQUEST);

    const user = this.req.user;
    if (!user) throw new HttpException('Not Authenticated', HttpStatus.UNAUTHORIZED);

    const course = await this.courseService.findOne(courseId);

    if (hasRole(user, Role.STAFF)) {
      this.req.course = course;
      return true;
    }

    if (course.creator.id === user.id) {
      this.req.course = course;
      return true;
    }

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}