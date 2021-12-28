import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { Repository } from 'typeorm';
import { SectionEntity } from './entities/section.entity';
import { generate } from 'randomstring';
import { ProfessorEntity } from '../user/entities/professor.entity';
import { ActivityEntity } from './entities/activity.entity';
import { CreateCourseDTO } from './dtos/CreateCourseDTO';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { UserEntity } from '../user/entities/user.entity';
import { hasRole } from '../user/auth';
import { Role } from '../../utils/types/roles.types';
import { StudentEntity } from '../user/entities/student.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
    @InjectRepository(SectionEntity) private sectionRepository: Repository<SectionEntity>,
    @InjectRepository(ActivityEntity) private activityRepository: Repository<ActivityEntity>,
    @InjectRepository(ClassroomEntity) private classroomRepo: Repository<ClassroomEntity>,
    @InjectRepository(StudentEntity) private studentRepo: Repository<StudentEntity>,
  ) {}

  async create(professor: ProfessorEntity, createCourseDto: CreateCourseDTO) {
    let course = this.courseRepository.create(createCourseDto.course);
    course.code = generate({
      length: 10,
      charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    });
    course.creator = professor;

    course = await this.courseRepository.save(course);

    // If a classroom is specified, add the course to the classroom
    if (createCourseDto.classId) {
      const classroom = await this.classroomRepo.findOne(createCourseDto.classId, { relations: ['courses'] });
      if (!classroom) throw new HttpException('Classroom not found', HttpStatus.NOT_FOUND);
      classroom.courses.push(course);
      await this.classroomRepo.save(classroom);
    }
    return course;
  }

  async findAll() {
    return await this.courseRepository.find();
  }

  async findOne(id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const course = await this.courseRepository.findOne(id);
    if (!course) throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    return course;
  }

  async update(id: string, updateCourseDto: CourseEntity) {
    return await this.courseRepository.update(id, updateCourseDto);
  }

  async remove(course: CourseEntity) {
    return await this.courseRepository.remove(course);
  }

  async removeSection(courseId: string, sectionId: string) {
    const section = await this.findSection(courseId, sectionId);
    return await this.sectionRepository.remove(section);
  }

  async removeActivity(courseId: string, sectionId: string, activityId: string) {
    const activity = await this.findActivity(courseId, sectionId, activityId);
    return await this.activityRepository.remove(activity);
  }

  async findOneWithSections(courseId) {
    const course = await this.courseRepository.findOne(courseId, { relations: ['sections'] });
    if (!course) throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    return course;
  }

  async createSection(courseId: string, createSectionDTO: SectionEntity) {
    const course = await this.findOneWithSections(courseId);

    const section = this.sectionRepository.create(createSectionDTO);
    await this.sectionRepository.save(section);

    course.sections.push(section);
    this.courseRepository.save(course);
    return section;
  }

  async filterCourseAccess(course: CourseEntity, user: UserEntity) {
    if (hasRole(user, Role.STAFF)) return true;
    if (course.creator.id === user.id) return true;
    // TODO: Better managing of course access private
    //if (course.access === COURSE_ACCESS.PRIVATE) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    if (user instanceof StudentEntity) {
      const student = await this.studentRepo.findOne(user.id, { relations: ['classrooms', 'classrooms.courses'] });
      if (!student) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      if (!student.classrooms.some(classroom => classroom.courses.some(c => c.id === course.id)))
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      return true;
    }

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  async getSections(courseId: string) {
    const course = await this.findOneWithSections(courseId);
    return course.sections;
  }

  async findSection(courseId: string, sectionId: string) {
    const course = await this.findOne(courseId);
    const section = await this.sectionRepository.findOne({
      where: { id: sectionId, course },
      relations: ['activities'],
    });
    if (!section) throw new HttpException('Section not found', HttpStatus.NOT_FOUND);
    return section;
  }

  async findActivity(courseId: string, sectionId: string, activityId: string) {
    const section = await this.findSection(courseId, sectionId);
    let activity = section.activities.find(a => a.id.toString() === activityId);
    if (!activity) throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);

    activity = await this.activityRepository.findOne(activity.id, { relations: ['levels'] });
    return activity;
  }

  async updateActivity(
    courseId: string,
    sectionId: string,
    activityId: string,
    updateActivityDTO: Partial<ActivityEntity>,
  ) {
    const section = await this.findSection(courseId, sectionId);
    const activity = section.activities.find(a => a.id.toString() === activityId);
    if (!activity) throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);

    return await this.activityRepository.save({ id: activity.id, ...updateActivityDTO });
  }

  async getActivities(courseId: string, sectionId: string) {
    const section = await this.findSection(courseId, sectionId);
    section.activities = section.activities.map(a => {
      delete a.content;
      return a;
    });
    return section.activities;
  }

  async addActivity(courseId: string, sectionId: string, activity: ActivityEntity) {
    activity = this.activityRepository.create(activity);
    await this.activityRepository.save(activity);

    const section = await this.findSection(courseId, sectionId);
    section.activities.push(activity);
    await this.sectionRepository.save(section);
    return activity;
  }
}
