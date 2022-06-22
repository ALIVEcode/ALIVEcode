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
import { CourseEntity } from './entities/course.entity';
import { CourseElementEntity } from './entities/course_element.entity';
import { SectionEntity } from './entities/section.entity';
import { ActivityVideoEntity } from './entities/activities/activity_video.entity';
import { ActivityPdfEntity } from './entities/activities/activity_pdf.entity';
import { CreateActivityDTO } from './dtos/CreateActivities.dto';
import { UpdateCourseElementDTO } from './dtos/UpdateCourseElement.dto';
import { CreateSectionDTO } from './dtos/CreateSection.dto';
import { ResourceEntity, RESOURCE_TYPE } from '../resource/entities/resource.entity';
import { ActivityAssignmentEntity } from './entities/activities/activity_assignment.entity';
import { ResourceChallengeEntity } from '../resource/entities/resources/resource_challenge.entity';
import { ChallengeEntity, CHALLENGE_ACCESS } from '../challenge/entities/challenge.entity';
import { ActivityWordEntity } from './entities/activities/activity_word.entity';
import { ActivityPowerPointEntity } from './entities/activities/activity_powerpoint.entity';

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
    @InjectRepository(ActivityWordEntity) private actWordRepo: Repository<ActivityWordEntity>,
    @InjectRepository(ActivityPowerPointEntity) private actPptxRepo: Repository<ActivityPowerPointEntity>,
    @InjectRepository(ClassroomEntity) private classroomRepo: Repository<ClassroomEntity>,
    @InjectRepository(CourseElementEntity) private courseElRepo: Repository<CourseElementEntity>,
    @InjectRepository(StudentEntity) private studentRepo: Repository<StudentEntity>,
    @InjectRepository(ChallengeEntity) private challengeRepo: Repository<ChallengeEntity>,
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
    if (createCourseDto.classId) await this.addCourseInClassroom(course, createCourseDto.classId);

    return course;
  }

  /**
   * Adds a course inside a classroom
   * @param course Course to add inside the classroom
   * @param classroomId Id of the classroom to add the course in
   * @returns The updated course
   */
  async addCourseInClassroom(course: CourseEntity, classroomId: string) {
    // If a classroom is specified, add the course to the classroom
    const classroom = await this.classroomRepo.findOne(classroomId, { relations: ['courses'] });
    if (!classroom) throw new HttpException('Classroom not found', HttpStatus.NOT_FOUND);
    classroom.courses.push(course);
    await this.classroomRepo.save(classroom);
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
  async clone(course: CourseEntity, newProfessor: ProfessorEntity, cloneDTO: CourseEntity) {
    if (!course.elements) course = await this.findCourseWithElements(course.id, false);
    /*const newCourse = await this.courseRepository.save({ ...course, id: undefined, creator: newProfessor });
    console.log(newCourse);*/
    const newCode = generate({
      length: 10,
      charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
    });

    const clonedCourse = await this.courseRepository.save({
      ...course,
      ...cloneDTO,
      creator: newProfessor,
      code: newCode,
      id: undefined,
      elements: undefined,
      classrooms: undefined,
    });

    const cloneElements = async (
      elements: CourseElementEntity[],
      elementsOrder: number[],
      sectionParentId?: string,
    ) => {
      const newElementsOrder: number[] = [];
      for (let i = 0; i < elementsOrder.length; i++) {
        const el = elements.find(e => e.id === elementsOrder[i]);
        if (!el) continue;
        const clonedEl = await this.courseElRepo.save({
          ...el,
          id: undefined,
          course: undefined,
          courseId: clonedCourse.id,
          section: undefined,
          activity: undefined,
          sectionParent: undefined,
          sectionParentId: sectionParentId,
        });
        // Is a section
        if (el.section) {
          if (!el.section.elements)
            el.section = await this.findSectionWithElements(course, el.section.id.toString(), false);

          clonedEl.section = await this.sectionRepository.save({
            ...el.section,
            id: undefined,
            courseElement: undefined,
            courseElementId: clonedEl.id,
            elements: undefined,
          });
          clonedEl.section.elementsOrder = await cloneElements(
            el.section.elements,
            el.section.elementsOrder,
            clonedEl.section.id,
          );
          await this.sectionRepository.save(clonedEl.section);
        } else if (el.activity) {
          clonedEl.activity = await this.saveActivity({
            ...el.activity,
            id: undefined,
            courseElementId: clonedEl.id,
            resource: null,
            resourceId: null,
          });
        }
        newElementsOrder.push((await this.courseElRepo.save(clonedEl)).id);
      }
      return newElementsOrder;
    };

    clonedCourse.elementsOrder = await cloneElements(course.elements, course.elementsOrder);
    return await this.courseRepository.save(clonedCourse);
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
  async createCourseElement(course: CourseEntity, name: string, sectionParent?: SectionEntity) {
    const parent = sectionParent || course;
    const courseId = course.id;
    const createdElement = this.courseElRepo.create({ course, courseId, sectionParent, name });

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
    parent.elements = undefined;
    if (parent instanceof SectionEntity) parent.courseElement = undefined;
    return parent instanceof CourseEntity
      ? await this.courseRepository.save(parent)
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
    // FIXME Convert to SQL (maybe?)
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

    let oldParent =
      courseElementWithParent.parentType() === 'course'
        ? course
        : await this.findSection(course, courseElementWithParent.sectionParent.id.toString());

    const sameParent = newParent.id === oldParent.id;

    if (sameParent) {
      // Move element in list order
      newParent.elementsOrder = newParent.elementsOrder.filter(elId => elId !== courseElementWithParent.id);
      newParent.elementsOrder.splice(index, 0, courseElementWithParent.id);

      // Save the parent
      await this.saveParent(newParent);
    } else {
      if (!(newParent instanceof SectionEntity)) courseElementWithParent.sectionParent = null;

      // Remove element from old parent
      oldParent.elementsOrder = oldParent.elementsOrder.filter(elId => elId !== courseElementWithParent.id);

      // Save the old parent
      oldParent = await this.saveParent(oldParent);

      // Add element into new parent
      newParent.elementsOrder.splice(index, 0, courseElementWithParent.id);

      // Save the new parent
      newParent = await this.saveParent(newParent);

      courseElementWithParent.course = course;
      if (newParent instanceof SectionEntity) {
        courseElementWithParent.sectionParent = newParent;
      } else {
        courseElementWithParent.sectionParent = null;
      }
      courseElementWithParent = await this.courseElRepo.save({
        ...courseElementWithParent,
        id: courseElementWithParent.id,
      });
    }

    return { orderNewParent: newParent.elementsOrder, orderOldParent: oldParent.elementsOrder };

    /*
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

    newParent.elementsOrder.splice(index, 0, courseElementWithParent.id);

    await this.courseElRepo.save({ ...courseElementWithParent, id: courseElementWithParent.id });
 
    if(!sameParent) {
    await this.saveParent(oldParent);
    !sameParent && (await this.saveParent(newParent));
    }

    return { newOrder: newParent.elementsOrder, oldOrder: oldParent.elementsOrder };
  */
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
    const res = await this.createCourseElement(course, sectionDTO.name, sectionParent);
    const section = await this.sectionRepository.save({
      ...sectionDTO.courseContent,
      courseElementId: res.courseElement.id.toString(),
    });
    res.courseElement.section = section;
    return res;
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
   * Saves an activity based on its type
   * @param activity Activity to save
   * @returns The updated saved activity
   */
  async saveActivity(activity: Partial<ActivityEntity>) {
    switch (activity.type) {
      case ACTIVITY_TYPE.CHALLENGE:
        return await this.actChallengeRepo.save(activity);
      case ACTIVITY_TYPE.THEORY:
        return await this.actTheoryRepo.save(activity);
      case ACTIVITY_TYPE.VIDEO:
        return await this.actVideoRepo.save(activity);
      case ACTIVITY_TYPE.PDF:
        return await this.actPdfRepo.save(activity);
      case ACTIVITY_TYPE.ASSIGNMENT:
        return await this.actAssignmentRepo.save(activity);
      case ACTIVITY_TYPE.WORD:
        return await this.actWordRepo.save(activity);
      case ACTIVITY_TYPE.POWERPOINT:
        return await this.actPptxRepo.save(activity);
      default:
        throw new HttpException(`Invalid activity type ${activity.type}`, HttpStatus.BAD_REQUEST);
    }
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
    const res = await this.createCourseElement(course, activityDTO.name, sectionParent);
    const activity = await this.saveActivity({
      ...activityDTO.courseContent,
      courseElementId: res.courseElement.id.toString(),
    });
    res.courseElement.activity = activity;
    return res;
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

    // Change the visibility of the challenge from private to restricted
    if (resource instanceof ResourceChallengeEntity) {
      const challenge = await this.challengeRepo.findOne(resource.challengeId);
      if (challenge.access === CHALLENGE_ACCESS.PRIVATE) {
        challenge.access = CHALLENGE_ACCESS.RESTRICTED;
        await this.challengeRepo.save(challenge);
      }
    }

    // Checks if the file resource is of the correct Mime type
    if (resource.type === RESOURCE_TYPE.FILE && !activity.acceptedMimeTypes.includes(resource.file.mimetype)) {
      throw new HttpException(
        `Mime type ${resource.file.mimetype} not accepted. ${activity.acceptedMimeTypes.join(
          ', ',
        )} are the only Mime types accepted`,
        HttpStatus.BAD_REQUEST,
      );
    }

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
  async getResourceOfActivity(activity: ActivityEntity, loadFile = false) {
    const relations = ['resource'];
    if (loadFile) relations.push('resource.file');
    return (await this.activityRepository.findOne(activity.id, { relations })).resource;
  }

  /*****-------End of Activity methods-------*****/
}
