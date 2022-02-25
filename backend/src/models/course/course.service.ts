import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseContent, CourseEntity } from './entities/course.entity';
import { Repository } from 'typeorm';
import { SectionEntity } from './entities/section.entity';
import { generate } from 'randomstring';
import { CreateCourseDTO } from './dtos/CreateCourseDTO';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { ProfessorEntity, StudentEntity } from '../user/entities/user.entity';
import { ActivityTheoryEntity } from './entities/activities/activity_theory.entity';
import { ActivityEntity } from './entities/activity.entity';
import { ActivityLevelEntity } from './entities/activities/activity_level.entity';
import { CourseElementEntity } from './entities/course_element.entity';

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

  /*****-------Course Elements-------*****/

  async findOneWithElements(courseId: string) {
    const course = await this.courseRepository.findOne(courseId, { relations: ['elements'] });
    if (!course) throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    return course;
  }

  async findCourseElement(course: CourseEntity, courseElementId: string) {
    return await this.courseElRepo.findOne({ where: { id: courseElementId, course } });
  }

  async createCourseElement(course: CourseEntity, content: CourseContent, sectionParent?: SectionEntity) {
    const parent = sectionParent || course;

    const createdElement = this.courseElRepo.create({ sectionParent });

    if (content instanceof SectionEntity) createdElement.section = content;
    else if (content instanceof ActivityEntity) createdElement.activity = content;
    const courseElement = await this.courseElRepo.save(createdElement);

    parent.elements.push(courseElement);
    parent.elementsOrder.push(courseElement.id);
    await this.saveParent(parent);

    return { courseElement, newOrder: parent.elementsOrder };
  }

  async saveParent(parent: CourseEntity | SectionEntity) {
    parent instanceof CourseEntity
      ? await this.courseRepository.save(parent)
      : await this.sectionRepository.save(parent);
  }

  async deleteCourseElement(courseElementWithParent: CourseElementEntity) {
    const res = await this.courseElRepo.delete(courseElementWithParent);

    const parent = courseElementWithParent.sectionParent || courseElementWithParent.course;
    parent.elementsOrder = parent.elementsOrder.filter((elementId: number) => elementId !== courseElementWithParent.id);
    await this.saveParent(parent);

    return res;
  }

  /*****-------End of Course Elements-------*****/

  /*****-------Section methods-------*****/

  async findSection(sectionId: string) {
    const section = await this.sectionRepository.findOne({
      where: { id: sectionId },
    });
    if (!section) throw new HttpException('Section not found', HttpStatus.NOT_FOUND);
    return section;
  }

  async findSectionWithElements(sectionId: string) {
    const section = await this.sectionRepository.findOne({
      where: { id: sectionId },
      relations: ['elements'],
    });
    if (!section) throw new HttpException('Section not found', HttpStatus.NOT_FOUND);
    return section;
  }

  async addSection(course: CourseEntity, sectionDTO: SectionEntity, sectionParent?: SectionEntity) {
    const section = await this.sectionRepository.save(sectionDTO);
    return await this.createCourseElement(course, section, sectionParent);
  }

  /*****-------End of Section methods-------*****/

  /*****-------Activities methods-------*****/

  async findActivity(courseId: string, id: string) {
    const activity = await this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.id = :id', { id })
      .innerJoinAndSelect('activity.courseElement', 'element')
      .innerJoinAndSelect('element.course', 'course')
      .andWhere('course.id = :courseId', { courseId })
      .getOne();

    if (!activity) throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
    return activity;
  }

  async addActivity(course: CourseEntity, activityDTO: ActivityEntity, sectionParent?: SectionEntity) {
    const activity = await this.activityRepository.save(activityDTO);
    return await this.createCourseElement(course, activity, sectionParent);
  }

  async updateActivity(activity: ActivityEntity, updateActivityDTO: Partial<ActivityEntity>) {
    return await this.activityRepository.save({ id: activity.id, ...updateActivityDTO });
  }

  /*****-------End of Activity methods-------*****/
}
