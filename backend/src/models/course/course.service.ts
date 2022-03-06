import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generate } from 'randomstring';
import { Repository } from 'typeorm';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { ProfessorEntity, StudentEntity } from '../user/entities/user.entity';
import { CreateCourseDTO } from './dtos/CreateCourse.dto';
import { ActivityLevelEntity } from './entities/activities/activity_level.entity';
import { ActivityTheoryEntity } from './entities/activities/activity_theory.entity';
import { ActivityEntity, ACTIVITY_TYPE } from './entities/activity.entity';
import { CourseContent, CourseEntity } from './entities/course.entity';
import { CourseElementEntity } from './entities/course_element.entity';
import { SectionEntity } from './entities/section.entity';
import { ActivityVideoEntity } from './entities/activities/activity_video.entity';
import { CreateActivityDTO } from './dtos/CreateActivities.dto';
import { UpdateCourseElementDTO } from './dtos/UpdateCourseElement.dto';
import { CreateSectionDTO } from './dtos/CreateSection.dto';

/**
 * All the methods to communicate to the database. To create/update/delete/get
 * a course or it's content (CourseElements)
 *
 * @author Enric Soldevila
 */
@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
    @InjectRepository(SectionEntity) private sectionRepository: Repository<SectionEntity>,
    @InjectRepository(ActivityEntity) private activityRepository: Repository<ActivityEntity>,
    @InjectRepository(ActivityTheoryEntity) private actTheoryRepo: Repository<ActivityTheoryEntity>,
    @InjectRepository(ActivityVideoEntity) private actVideoRepo: Repository<ActivityLevelEntity>,
    @InjectRepository(ActivityLevelEntity) private actLevelRepo: Repository<ActivityLevelEntity>,
    @InjectRepository(ClassroomEntity) private classroomRepo: Repository<ClassroomEntity>,
    @InjectRepository(CourseElementEntity) private courseElRepo: Repository<CourseElementEntity>,
    @InjectRepository(StudentEntity) private studentRepo: Repository<StudentEntity>,
  ) {}

  /**
   * Method to create a course as a professor. Create the course inside
   * a classroom or not.
   * @param professor Professor that creates the course
   * @param createCourseDto DTO of the course to create
   * @returns the newly created course
   * @throws HttpException Classroom not found
   */
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

  /**
   * Method that returns all the courses in the database
   * @returns All the courses in the database
   */
  async findAll() {
    return await this.courseRepository.find();
  }

  /**
   * Finds a course of a certain id
   * @param id id of the course to get
   * @returns The course found
   * @throws HttpException Course not found
   */
  async findOne(id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const course = await this.courseRepository.findOne(id);
    if (!course) throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    return course;
  }

  /**
   * Update a course with a certain id, with the CourseEntity DTO.
   * @param id id of the course to update
   * @param updateCourseDto CourseEntity DTO to update the course with
   * @returns The updated course
   */
  async update(id: string, updateCourseDto: CourseEntity) {
    return await this.courseRepository.save({ ...updateCourseDto, id });
  }

  /**
   * Removes a course from the database
   * @param course Course to remove
   * @returns The result of removing the course
   */
  async remove(course: CourseEntity) {
    return await this.courseRepository.remove(course);
  }

  /*****-------Course Elements-------*****/

  /**
   * Loads a course in the database and joins its elements
   * @param courseId id of the course to load with it's elements
   * @returns The course loaded with its elements
   * @throws HttpException Course not found
   */
  async findOneWithElements(courseId: string) {
    const course = await this.courseRepository.findOne(courseId, { relations: ['elements'] });
    if (!course) throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    return course;
  }

  /**
   * Finds a course element by id inside a course.
   * @param course Course to get the element from
   * @param courseElementId id of the CourseElement to get
   * @returns The CourseElement found
   * @throws HttpException CourseElement not found
   */
  async findCourseElement(course: CourseEntity, courseElementId: string) {
    const courseElement = await this.courseElRepo.findOne({ where: { id: courseElementId, course } });
    if (!courseElement) throw new HttpException('CourseElement not found', HttpStatus.NOT_FOUND);
    return courseElement;
  }

  /**
   * Finds a course element by id inside a course with the parent loaded.
   * @param course Course to get the element from
   * @param courseElementId id of the CourseElement to get
   * @returns The CourseElement found
   * @throws HttpException CourseElement not found
   */
  async findCourseElementWithParent(course: CourseEntity, courseElementId: string) {
    const courseElement = await this.courseElRepo.findOne({
      where: { id: courseElementId, course },
      relations: ['course', 'sectionParent'],
    });
    if (!courseElement) throw new HttpException('CourseElement not found', HttpStatus.NOT_FOUND);
    return courseElement;
  }

  /**
   * Creates a CourseElement directly in a course or in section with an activity or section inside it
   * @param course Course to create the CourseElement in
   * @param content The activity or section to add inside the CourseElement
   * @param sectionParent (OPTIONAL) The section in which to add the CourseElement.
   *                      If not specified, add the CourseElement directly inside the course
   * @returns The created CourseElement containing the section or activity
   */
  async createCourseElement(course: CourseEntity, name: string, content: CourseContent, sectionParent?: SectionEntity) {
    const parent = sectionParent || course;

    const createdElement = this.courseElRepo.create({ course, sectionParent, name });

    if (content instanceof SectionEntity) createdElement.section = content;
    else createdElement.activity = content;
    const courseElement = await this.courseElRepo.save(createdElement);

    parent.elements.push(courseElement);
    parent.elementsOrder.push(courseElement.id);
    await this.saveParent(parent);

    return { courseElement, newOrder: parent.elementsOrder };
  }

  /**
   * Save the parent (Course or Section) to save inside the database
   * @param parent Course or Section to save
   */
  async saveParent(parent: CourseEntity | SectionEntity) {
    parent instanceof CourseEntity
      ? await this.courseRepository.save(parent)
      : await this.sectionRepository.save(parent);
  }

  /**
   * Deletes a CourseElement alongside its content (Activity or Section).
   * Also reorder the elementsOrder inside its parent
   * @param courseElementWithParent CourseElement with its the parent loaded
   * @returns the deletion query result
   */
  async deleteCourseElement(courseElementWithParent: CourseElementEntity) {
    const elId = courseElementWithParent.id;
    const res = await this.courseElRepo.remove(courseElementWithParent);

    // Changing parent order
    const parent = courseElementWithParent.sectionParent || courseElementWithParent.course;
    parent.elementsOrder = parent.elementsOrder.filter(elementId => elementId !== elId);
    await this.saveParent(parent);

    return res;
  }

  /**
   * Deletes a CourseElement alongside its content (Activity or Section).
   * Also reorder the elementsOrder inside its parent
   * @param courseElement CourseElement with its the parent loaded
   * @returns the deletion query result
   */
  async updateCourseElement(courseElement: CourseElementEntity, dto: UpdateCourseElementDTO) {
    return await this.courseElRepo.save({ id: courseElement.id, ...dto });
  }

  /*****-------End of Course Elements-------*****/

  /*****-------Section methods-------*****/

  /**
   * Finds a section inside a course by its id
   * @param course course of the section
   * @param sectionId Id of the section to get
   * @returns The section found
   * @throws HttpException Section not found
   */
  async findSection(course: CourseEntity, sectionId: string) {
    const section = await this.sectionRepository
      .createQueryBuilder('section')
      .where('section.id = :id', { id: sectionId })
      .leftJoinAndSelect('section.courseElement', 'element')
      .leftJoinAndSelect('element.section', 'section')
      .leftJoinAndSelect('element.activity', 'activity')
      .andWhere('element.courseId = :courseId', { courseId: course.id })
      .getOne();
    if (!section) throw new HttpException('Section not found', HttpStatus.NOT_FOUND);

    return section;
  }

  /**
   * Finds a section inside a course by its id and load its elements alongside
   * @param course course of the section
   * @param sectionId Id of the section to get
   * @returns The section found
   * @throws HttpException Section not found
   */
  async findSectionWithElements(course: CourseEntity, sectionId: string) {
    const section = await this.sectionRepository
      .createQueryBuilder('sectionParent')
      .where('sectionParent.id = :id', { id: sectionId })
      .leftJoinAndSelect('sectionParent.elements', 'elements')
      .leftJoinAndSelect('sectionParent.courseElement', 'element')
      .leftJoinAndSelect('elements.activity', 'activity')
      .leftJoinAndSelect('activity.resource', 'resource')
      .leftJoinAndSelect('elements.section', 'section')
      .andWhere('element.courseId = :courseId', { courseId: course.id })
      .getOne();
    if (!section) throw new HttpException('Section not found', HttpStatus.NOT_FOUND);
    return section;
  }

  /**
   * Adds a section directly inside a course or inside another section
   * @param course Course to add the section to
   * @param sectionDTO DTO of the section to create
   * @param sectionParent (OPTIONAL) Section in which to add the element
   *                      If not specified, add the Section is directly added inside the course
   * @returns the created CourseElement containing the section and the new order of elements in its parent
   */
  async addSection(course: CourseEntity, sectionDTO: CreateSectionDTO, sectionParent?: SectionEntity) {
    const section = await this.sectionRepository.save(sectionDTO.courseContent);
    return await this.createCourseElement(course, sectionDTO.name, section, sectionParent);
  }

  /*****-------End of Section methods-------*****/

  /*****-------Activities methods-------*****/

  /**
   * Find an activity by its id and its course
   * @param courseId id of the course to look for the activity
   * @param id Id of the activity to get
   * @returns The found activity
   * @throws HttpException Activity not found
   */
  async findActivity(courseId: string, id: string) {
    const activity = await this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.id = :id', { id })
      .leftJoinAndSelect('activity.courseElement', 'element')
      .andWhere('element.courseId = :courseId', { courseId })
      .getOne();

    if (!activity) throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
    return activity;
  }

  /**
   * Loads the content of an activity (The non-generic fields of the activity)
   * @param courseId Id of the course containing the activity
   * @param id Id of the activity to load content from
   * @returns The activity with the content loaded
   */
  async findActivityWithContentLoaded(courseId: string, id: string) {
    const activity = await this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.id = :id', { id })
      .leftJoinAndSelect('activity.courseElement', 'element')
      .leftJoinAndSelect('activity.resource', 'resource')
      .andWhere('element.courseId = :courseId', { courseId })
      .getOne();

    if (!activity) throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
    return activity;
  }

  /**
   * Adds a section directly inside a course or inside another section
   * @param course Course to add the section to
   * @param sectionDTO DTO of the section to create
   * @param sectionParent (OPTIONAL) Section in which to add the element
   *                      If not specified, add the Section is directly added inside the course
   * @returns the created CourseElement containing the activity and the new order of elements in its parent
   */
  async addActivity(course: CourseEntity, activityDTO: CreateActivityDTO, sectionParent?: SectionEntity) {
    let activity: ActivityEntity;
    switch (activityDTO.courseContent.type) {
      case ACTIVITY_TYPE.LEVEL:
        activity = await this.actLevelRepo.save(activityDTO);
        break;
      case ACTIVITY_TYPE.THEORY:
        activity = await this.actTheoryRepo.save(activityDTO);
        break;
      case ACTIVITY_TYPE.VIDEO:
        activity = await this.actVideoRepo.save(activityDTO);
        break;
      default:
        throw new HttpException('Invalid activity type', HttpStatus.BAD_REQUEST);
    }
    return await this.createCourseElement(course, activityDTO.name, activity, sectionParent);
  }

  /**
   * Updates the data of an activity
   * @param activity Activity to update
   * @param updateActivityDTO DTO to update the activity with
   * @returns The updated activty
   */
  async updateActivity(activity: ActivityEntity, updateActivityDTO: Partial<ActivityEntity>) {
    return await this.activityRepository.save({ id: activity.id, ...updateActivityDTO });
  }

  /*****-------End of Activity methods-------*****/
}
