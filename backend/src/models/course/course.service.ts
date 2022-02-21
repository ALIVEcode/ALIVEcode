import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseContent, CourseEntity } from './entities/course.entity';
import { Repository } from 'typeorm';
import { SectionEntity } from './entities/section.entity';
import { generate } from 'randomstring';
import { CreateCourseDTO } from './dtos/CreateCourseDTO';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { ProfessorEntity, StudentEntity, UserEntity } from '../user/entities/user.entity';
import { hasRole } from '../user/auth';
import { Role } from '../../utils/types/roles.types';
import { ActivityTheoryEntity } from './entities/activities/activity_theory.entity';
import { ActivityEntity } from './entities/activity.entity';
import { ActivityLevelEntity } from './entities/activities/activity_level.entity';
import { CreateActivityLevelDTO, CreateActivityTheoryDTO, CreateActivityVideoDTO } from './dtos/CreateActivitiesDTO';
import { CourseElementEntity } from './entities/course_element.entity';
import { isUUID } from 'class-validator';
import { validUUID } from '../../utils/types/validation.types';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
    @InjectRepository(SectionEntity) private sectionRepository: Repository<SectionEntity>,
    @InjectRepository(ActivityEntity) private activityRepository: Repository<ActivityEntity>,
    @InjectRepository(ActivityTheoryEntity) private actTheoryRepo: Repository<ActivityTheoryEntity>,
    @InjectRepository(ActivityLevelEntity) private actLevelRepo: Repository<ActivityLevelEntity>,
    @InjectRepository(ClassroomEntity) private classroomRepo: Repository<ClassroomEntity>,
    @InjectRepository(CourseElementEntity) private courseElRepo: Repository<CourseElementEntity>,
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

  async removeSection(sectionId: string) {
    const section = await this.findSectionWithElements(sectionId);
    return await this.sectionRepository.remove(section);
  }

  async removeActivity(activityId: string) {
    throw new HttpException('Not implmented', HttpStatus.NOT_IMPLEMENTED);
    /*
    const activity = await this.findActivity(courseId, sectionId, activityId);
    return await this.activityRepository.remove(activity);*/
  }

  async findOneWithElements(courseId: string) {
    const course = await this.courseRepository.findOne(courseId, { relations: ['elements'] });
    if (!course) throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    return course;
  }

  async createCourseElement(parent: CourseEntity | SectionEntity, content: CourseContent) {
    const dto = { ...(parent instanceof CourseEntity ? { courseParent: parent } : { sectionParent: parent }) };
    let courseElement: CourseElementEntity;

    if (content instanceof SectionEntity) courseElement = await this.courseElRepo.save({ ...dto, section: content });
    else if (content instanceof ActivityEntity)
      courseElement = await this.courseElRepo.save({ ...dto, activity: content });
    else throw new HttpException('Invalid course content', HttpStatus.INTERNAL_SERVER_ERROR);

    parent.elements.push(courseElement);
    parent.elements_order.push(courseElement.id);
    parent instanceof CourseEntity
      ? await this.courseRepository.save(parent)
      : await this.sectionRepository.save(parent);

    return courseElement;
  }

  async createSection(courseId: string, createSectionDTO: SectionEntity) {
    const course = await this.findOneWithElements(courseId);
    const section = await this.sectionRepository.save(createSectionDTO);
    return await this.createCourseElement(course, section);
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

  async findSectionWithElements(sectionId: string) {
    const section = await this.sectionRepository.findOne({
      where: { id: sectionId },
      relations: ['elements'],
    });
    if (!section) throw new HttpException('Section not found', HttpStatus.NOT_FOUND);
    return section;
  }

  async findActivity(courseId: string, sectionId: string, activityId: string) {
    throw new HttpException('Not implmented', HttpStatus.NOT_IMPLEMENTED);
    /*
    const section = await this.findSection(courseId, sectionId);
    let activity = section.activities.find(a => a.id.toString() === activityId);
    if (!activity) throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);

    activity = await this.activityRepository.findOne(activity.id, { relations: ['levels'] });
    return activity;
    */
  }

  async updateActivity(
    courseId: string,
    sectionId: string,
    activityId: string,
    updateActivityDTO: Partial<ActivityEntity>,
  ) {
    throw new HttpException('Not implmented', HttpStatus.NOT_IMPLEMENTED);
    /*
    const section = await this.findSection(courseId, sectionId);
    const activity = section.activities.find(a => a.id.toString() === activityId);
    if (!activity) throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);

    return await this.activityRepository.save({ id: activity.id, ...updateActivityDTO });*/
  }

  async createActivity(
    parentId: string,
    activity: CreateActivityLevelDTO | CreateActivityTheoryDTO | CreateActivityVideoDTO,
  ) {
    const parent = validUUID(parentId)
      ? await this.findOneWithElements(parentId)
      : await this.findSectionWithElements(parentId);
    return await this.createCourseElement(parent, activity);
  }
}
