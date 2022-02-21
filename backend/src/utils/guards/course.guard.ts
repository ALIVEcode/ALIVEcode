import { Injectable, ExecutionContext, Inject, CanActivate, HttpException, HttpStatus } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { hasRole } from '../../models/user/auth';
import { Role } from '../types/roles.types';
import { MyRequest } from './auth.guard';
import { CourseService } from '../../models/course/course.service';
import { StudentEntity } from '../../models/user/entities/user.entity';
import { UserService } from '../../models/user/user.service';

@Injectable()
export class CourseAccess implements CanActivate {
  constructor(
    public courseService: CourseService,
    public userService: UserService,
    @Inject(REQUEST) public req: MyRequest,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.req.course != null) return true;

    const courseId = this.req.params.id;
    if (!courseId) throw new HttpException('Bad payload', HttpStatus.BAD_REQUEST);

    const user = this.req.user;
    if (!user) throw new HttpException('You are not logged in', HttpStatus.UNAUTHORIZED);

    const course = await this.courseService.findOne(courseId);

    if (hasRole(user, Role.STAFF)) {
      this.req.course = course;
      return true;
    }

    if (course.creator.id === user.id) {
      this.req.course = course;
      return true;
    }
    // TODO: Better managing of course access private
    //if (course.access === COURSE_ACCESS.PRIVATE) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    if (user instanceof StudentEntity) {
      const classrooms = await this.userService.getClassrooms(user);
      if (!classrooms.some(classroom => classroom.courses.some(c => c.id === course.id)))
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
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

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.req.course != null) return true;

    const courseId = this.req.params.id;
    if (!courseId) throw new HttpException('Bad payload', HttpStatus.BAD_REQUEST);

    const user = this.req.user;
    if (!user) throw new HttpException('You are not logged in', HttpStatus.UNAUTHORIZED);

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