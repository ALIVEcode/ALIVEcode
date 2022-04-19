import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generate } from 'randomstring';
import { Repository } from 'typeorm';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { ProfessorEntity, StudentEntity } from '../user/entities/user.entity';
import { CreateCourseDTO } from './dtos/CreateCourse.dto';
import { ActivityChallengeEntity } from './entities/activities/activity_challenge.entity';
import { ActivityTheoryEntity } from './entities/activities/activity_theory.entity';
import { ActivityEntity, ACTIVITY_TYPE } from './entities/activity.entity';
import { CourseContent, CourseEntity } from './entities/course.entity';
import { CourseElementEntity } from './entities/course_element.entity';
import { SectionEntity } from './entities/section.entity';
import { ActivityVideoEntity } from './entities/activities/activity_video.entity';
import { ActivityPdfEntity } from './entities/activities/activity_pdf.entity';
import { CreateActivityDTO } from './dtos/CreateActivities.dto';
import { UpdateCourseElementDTO } from './dtos/UpdateCourseElement.dto';
import { CreateSectionDTO } from './dtos/CreateSection.dto';
import { ResourceEntity } from '../resource/entities/resource.entity';
import { ActivityAssignmentEntity } from './entities/activities/activity_assignment.entity';

/**
 * All the methods to communicate to the database. To create/update/delete/get
 * a course or it's content (CourseElements)
 *
 * @author Enric Soldevila, Mathis Laroche
 */
@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(CourseEntity) private courseRepository: Repository<CourseEntity>,
    @InjectRepository(SectionEntity) private sectionRepository: Repository<SectionEntity>,
    @InjectRepository(ActivityEntity) private activityRepository: Repository<ActivityEntity>,
    @InjectRepository(ActivityTheoryEntity) private actTheoryRepo: Repository<ActivityTheoryEntity>,
    @InjectRepository(ActivityVideoEntity) private actVideoRepo: Repository<ActivityVideoEntity>,
    @InjectRepository(ActivityPdfEntity) private actPdfRepo: Repository<ActivityPdfEntity>,
    @InjectRepository(ActivityAssignmentEntity) private actAssignmentRepo: Repository<ActivityAssignmentEntity>,
    @InjectRepository(ActivityChallengeEntity) private actChallengeRepo: Repository<ActivityChallengeEntity>,
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
   * @throws HttpException Bad request
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

  /**
   * Clones the entirety of a course with its nested relations in the database
   * and return the cloned version
   * @param course Course to clone
   */
  async clone(course: CourseEntity) {
    if (!course.elements) course = await this.findCourseWithElements(course.id, false);

    course.elements.map(el => {
      // Is a section
      if (el.section) {
      }
      // Is an activity
      else if (el.activity) {
      }
    });
    return null;
  }

  /*****-------Course Elements-------*****/

  /**
   * Loads a course in the database and joins its elements
   * @param courseId id of the course to load with its elements
   * @param onlyVisible tell if the invisible elements should be excluded
   * @returns The course loaded with its elements
   * @throws HttpException Course not found
   */
  async findCourseWithElements(courseId: string, onlyVisible: boolean) {
    const course = await this.courseRepository
      .createQueryBuilder('course')
      .leftJoinAndSelect(
        'course.elements',
        'elements',
        onlyVisible ? 'elements.isVisible = :isVisible' : undefined,
        onlyVisible ? { isVisible: true } : undefined,
      )
      .leftJoinAndSelect('elements.activity', 'activity')
      .leftJoinAndSelect('elements.section', 'section')
      .where('course.id = :courseId', { courseId })
      .andWhere('elements.sectionParentId IS NULL')
      .getOne();
    /*const course = await this.courseRepository.findOne(courseId, {
			where: { 'elements.section': null },
			relations: ['elements'],
		});*/
    if (!course) throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    course.elements.forEach(element => (element.courseId = course.id));
    return course;
  }

  /**
   * Finds a parent with its direct elements already loaded
   * @param course Course containing the parent
   * @param parent Parent to get the elements of
   * @param onlyVisible
   * @returns The parent with the elements directly inside it loaded
   */
  async findParentWithElements(course: CourseEntity, parent: SectionEntity | CourseEntity, onlyVisible: boolean) {
    if (parent instanceof CourseEntity) return this.findCourseWithElements(parent.id, onlyVisible);
    if (parent instanceof SectionEntity) return this.findSectionWithElements(course, parent.id.toString(), onlyVisible);
  }

  /**
   * Finds a course element by id inside a course.
   * @param course Course to get the element from
   * @param courseElementId id of the CourseElement to get
   * @returns The CourseElement found
   * @throws HttpException CourseElement not found
   */
  async findCourseElement(course: CourseEntity, courseElementId: string) {
    const courseElement = await this.courseElRepo.findOne({ where: { id: courseElementId, courseId: course.id } });
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
      where: { id: courseElementId, courseId: course.id },
      relations: ['course', 'sectionParent'],
    });
    if (!courseElement) throw new HttpException('CourseElement not found', HttpStatus.NOT_FOUND);
    return courseElement;
  }

  /**
   * Creates a CourseElement directly in a course or in section with an activity or section inside it
   * @param course Course to create the CourseElement in
   * @param name Name of the CourseElement to create
   * @param content The activity or section to add inside the CourseElement
   * @param sectionParent (OPTIONAL) The section in which to add the CourseElement.
   *                      If not specified, add the CourseElement directly inside the course
   * @returns The created CourseElement containing the section or activity
   */
  async createCourseElement(course: CourseEntity, name: string, content: CourseContent, sectionParent?: SectionEntity) {
    const parent = sectionParent || course;
    const courseId = course.id;
    const createdElement = this.courseElRepo.create({ course, courseId, sectionParent, name });

    if (content instanceof SectionEntity) createdElement.section = content;
    else createdElement.activity = content;
    const courseElement = await this.courseElRepo.save(createdElement);

    parent.elements.push(courseElement);
    parent.elementsOrder.push(courseElement.id);
    parent.elements.forEach(element => (element.courseId = course.id));
    await this.saveParent(parent);

    return { courseElement, newOrder: parent.elementsOrder };
  }

  /**
   * Save the parent (Course or Section) to save inside the database
   * @param parent Course or Section to save
   */
  async saveParent(parent: CourseEntity | SectionEntity) {
    parent instanceof CourseEntity
      ? await this.courseRepository.save(parent).catch(err => {
          console.log(err);
        })
      : await this.sectionRepository.save(parent);
  }

  /**
   * Deletes a CourseElement alongside its content (Activity or Section).
   * Also reorder the elementsOrder inside its parent
   * @param courseElementWithParent CourseElement with its parent loaded
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
   * Updates a CourseElement alongside its content (Activity or Section).
   * Also reorder the elementsOrder inside its parent
   * @param course
   * @param courseElement CourseElement with its parent loaded
   * @param dto
   * @returns an array containing all the courseElements that were updated
   */
  async updateCourseElement(course: CourseEntity, courseElement: CourseElementEntity, dto: UpdateCourseElementDTO) {
    let results = [await this.courseElRepo.save({ ...dto, id: courseElement.id })];
    if (dto.isVisible !== undefined && courseElement.section) {
      const elements =
        courseElement.section.elements ??
        (await this.findParentWithElements(course, courseElement.section, false)).elements;
      for (const element of elements) {
        results = results.concat(await this.updateCourseElement(course, element, { isVisible: dto.isVisible }));
      }
    }
    return results;
  }

  /**
   * Moves an element from a parent into another parent with a positioning index.
   * Needs to be inside the same course!
   * @param course Course in which the move occurs
   * @param courseElementWithParent Course element to move with its parent loaded
   * @param newParent Parent in which the element will be moved
   * @param index Index of the positioning of the element in the new parent
   */
  async moveElement(
    course: CourseEntity,
    courseElementWithParent: CourseElementEntity,
    newParent: CourseEntity | SectionEntity,
    index: number,
  ) {
    // Checks if the element is tried to be moved into another course
    if (
      (newParent instanceof CourseEntity && course.id !== newParent.id) ||
      (newParent instanceof SectionEntity && newParent.courseElement.courseId !== course.id)
    )
      throw new HttpException("Forbidden, can't move this element into another course", HttpStatus.FORBIDDEN);

    const oldParent =
      courseElementWithParent.parent instanceof CourseEntity
        ? course
        : await this.findSectionWithElements(course, courseElementWithParent.sectionParent.id.toString(), false);
    const sameParent = newParent.id === oldParent.id;

    // Removes or moves the element in the old parent
    if (!sameParent) {
      oldParent.elementsOrder = oldParent.elementsOrder.filter(elementId => elementId !== courseElementWithParent.id);
      oldParent.elements = oldParent.elements.filter(element => element.id !== courseElementWithParent.id);
    } else {
      oldParent.elementsOrder = oldParent.elementsOrder.filter(elementId => elementId !== courseElementWithParent.id);
    }

    console.log(newParent.elementsOrder);

    if (newParent instanceof CourseEntity) {
      // courseElementWithParent.course = newParent;
      courseElementWithParent.sectionParent = null;
    } else if (newParent instanceof SectionEntity) {
      courseElementWithParent.sectionParent = newParent;
      newParent.elements.push(courseElementWithParent);
    }

    !sameParent && newParent.elementsOrder.splice(index, 0, courseElementWithParent.id);

    await this.courseElRepo.save({ ...courseElementWithParent, id: courseElementWithParent.id });
    await this.saveParent(oldParent);
    !sameParent && (await this.saveParent(newParent));

    return { newOrder: newParent.elementsOrder, oldOrder: oldParent.elementsOrder };
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
      .andWhere('element.courseId = :courseId', { courseId: course.id })
      .getOne();
    if (!section) throw new HttpException('Section not found', HttpStatus.NOT_FOUND);

    return section;
  }

  /**
   * Finds a section inside a course by its id and load its elements alongside
   * @param course course of the section
   * @param sectionId Id of the section to get
   * @param onlyVisible tell if the invisible elements should be excluded
   * @returns The section found
   * @throws HttpException Section not found
   */
  async findSectionWithElements(course: CourseEntity, sectionId: string, onlyVisible: boolean) {
    const section = await this.sectionRepository
      .createQueryBuilder('sectionParent')
      .where('sectionParent.id = :id', { id: sectionId })
      .leftJoinAndSelect(
        'sectionParent.elements',
        'elements',
        onlyVisible ? 'elements.isVisible = :isVisible' : undefined,
        onlyVisible ? { isVisible: true } : undefined,
      )
      .leftJoinAndSelect('sectionParent.courseElement', 'element')
      .leftJoinAndSelect('elements.activity', 'activity')
      .leftJoinAndSelect('elements.section', 'section')
      .andWhere('element.courseId = :courseId', { courseId: course.id })
      .getOne();
    if (!section) throw new HttpException('Section not found', HttpStatus.NOT_FOUND);
    // section.courseElement.courseId = course.id;
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
   * Adds a section directly inside a course or inside another section
   * @param course Course to add the section to
   * @param activityDTO
   * @param sectionParent (OPTIONAL) Section in which to add the element
   *                      If not specified, add the Section is directly added inside the course
   * @returns the created CourseElement containing the activity and the new order of elements in its parent
   * @throws HttpException Invalid activity type
   */
  async addActivity(course: CourseEntity, activityDTO: CreateActivityDTO, sectionParent?: SectionEntity) {
    let activity: ActivityEntity;
    switch (activityDTO.courseContent.type) {
      case ACTIVITY_TYPE.CHALLENGE:
        activity = await this.actChallengeRepo.save(activityDTO.courseContent);
        break;
      case ACTIVITY_TYPE.THEORY:
        activity = await this.actTheoryRepo.save(activityDTO.courseContent);
        break;
      case ACTIVITY_TYPE.VIDEO:
        activity = await this.actVideoRepo.save(activityDTO.courseContent);
        break;
      case ACTIVITY_TYPE.PDF:
        activity = await this.actPdfRepo.save(activityDTO.courseContent);
        break;
      case ACTIVITY_TYPE.ASSIGNMENT:
        activity = await this.actAssignmentRepo.save(activityDTO.courseContent);
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
   * @returns The updated activity
   */
  async updateActivity(activity: ActivityEntity, updateActivityDTO: Partial<ActivityEntity>) {
    return await this.activityRepository.save({ ...updateActivityDTO, id: activity.id });
  }

  /**
   * Add a resource to an activity
   * @param activity Course found with the id in the url
   * @param resource
   * @returns The newly updated activity
   */
  async addResourceToActivity(activity: ActivityEntity, resource: ResourceEntity) {
    // Check if the activity accept this type of resource
    if (!activity.allowedResources.includes(resource.type))
      throw new HttpException('Cannot add this type of resource to this activity', HttpStatus.BAD_REQUEST);

    activity.resource = resource;
    return await this.activityRepository.save(activity);
  }

  /**
   * Remove a resource from an activity
   * @param activity Course found with the id in the url
   * @returns The removal query result
   */
  async removeResourceFromActivity(activity: ActivityEntity) {
    activity.resource = null;
    return await this.activityRepository.save(activity);
  }

  /**
   * Gets the resource of an activity
   * @param activity Course found with the id in the url
   * @returns The removal query result
   */
  async getResourceOfActivity(activity: ActivityEntity) {
    return (await this.activityRepository.findOne(activity.id, { relations: ['resource'] })).resource;
  }

  /*****-------End of Activity methods-------*****/
}
