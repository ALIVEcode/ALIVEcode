import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Res,
  Req,
} from '@nestjs/common';
import { statSync, createReadStream } from 'fs';
import { Request, Response } from 'express';
import { Auth } from '../../utils/decorators/auth.decorator';
import { Course } from '../../utils/decorators/course.decorator';
import { User } from '../../utils/decorators/user.decorator';
import { CourseAccess, CourseProfessor } from '../../utils/guards/course.guard';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { Role } from '../../utils/types/roles.types';
import { ProfessorEntity, UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CourseService } from './course.service';
import {
  CreateActivityChallengeDTO,
  CreateActivityTheoryDTO,
  CreateActivityVideoDTO,
  CreateActivityPdfDTO,
} from './dtos/CreateActivities.dto';
import { CreateCourseDTO } from './dtos/CreateCourse.dto';
import { CreateSectionDTO } from './dtos/CreateSection.dto';
import { ActivityEntity, ACTIVITY_TYPE } from './entities/activity.entity';
import { CourseEntity } from './entities/course.entity';
import { CourseElementEntity } from './entities/course_element.entity';
import { UpdateCourseElementDTO } from './dtos/UpdateCourseElement.dto';
import { AddResourceDTO } from './dtos/AddResource.dto';
import { ResourceService } from '../resource/resource.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateActivityAssignmentDTO } from './dtos/CreateActivities.dto';
import { RESOURCE_TYPE } from '../resource/entities/resource.entity';
import { ResourceFileEntity } from '../resource/entities/resources/resource_file.entity';
import { ResourceVideoEntity } from '../resource/entities/resources/resource_video.entity';
import { MoveElementDTO } from './dtos/MoveElement.dto';
import { isUUID } from 'class-validator';
import { SectionEntity } from './entities/section.entity';
import { AddCourseInClassroomDTO } from './dtos/AddCourseInClassroom';
import { ChallengeService } from '../challenge/challenge.service';
import { ResourceChallengeEntity } from '../resource/entities/resources/resource_challenge.entity';

/**
 * All the routes to create/update/delete/get a course or it's content (CourseElements)
 * @author Enric Soldevila
 */
@Controller('courses')
@ApiTags('courses')
@UseInterceptors(DTOInterceptor)
export class CourseController {
  constructor(
    private readonly courseService: CourseService,
    private readonly userService: UserService,
    private readonly resourceService: ResourceService,
    private readonly challengeService: ChallengeService,
  ) {}

  /**
   * Route to create a course as a professor. Professor only
   * @param user Professor that creates the course
   * @param createCourseDto DTO of the course to create
   * @returns the newly created course
   */
  @Post()
  @Auth(Role.PROFESSOR)
  async create(@User() user: ProfessorEntity, @Body() createCourseDto: CreateCourseDTO) {
    return await this.courseService.create(user, createCourseDto);
  }

  /**
   * Route that returns all the courses in the database. Staff only
   * @returns All the courses in the database
   */
  @Get('all')
  @Auth(Role.STAFF)
  async findAll() {
    return await this.courseService.findAll();
  }

  /**
   * Route to find a course of a certain id. Must have access to the course
   * @param course Course found with the id in the url
   * @returns The course found
   */
  @Get(':id')
  @Auth()
  @UseGuards(CourseAccess)
  async findOne(@Course() course: CourseEntity) {
    return course;
  }

  /**
   * Route to update a course with a certain id, with the CourseEntity DTO. Must be the creator of the course
   * @param course Course found with the id in the url
   * @param updateCourseDto CourseEntity DTO to update the course with
   * @returns The updated course
   */
  @Patch(':id')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async update(@Course() course: CourseEntity, @Body() updateCourseDto: CourseEntity) {
    return await this.courseService.update(course.id, updateCourseDto);
  }

  /**
   * Route to add a course inside a classroom
   * @param course Course to add inside the classroom
   * @param dto DTO to add a course inside a classroom
   * @returns The updated course
   */
  @Post(':id')
  @Auth()
  @UseGuards(CourseAccess)
  async addCourseInClassroom(@Body() dto: AddCourseInClassroomDTO, @Course() course: CourseEntity) {
    return await this.courseService.addCourseInClassroom(course, dto.classId);
  }

  /**
   * Route to remove a course with a certain id. Must be the creator of the course
   * @param course Course found with the id in the url
   * @returns The result of removing the course
   */
  @Delete(':id')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async remove(@Course() course: CourseEntity) {
    return await this.courseService.remove(course);
  }

  /**
   * Route to create a section directly inside a course or inside a section and
   * wraps it in a CourseElement. Must be the creator of a professor
   * @param course Course found with the id in the url
   * @param createSectionDTO The section DTO to create
   * @returns The newly created CourseElement containing the section and the updated order of the elements in the course
   */
  @Post(':id/sections')
  @UseGuards(CourseProfessor)
  @Auth(Role.PROFESSOR, Role.STAFF)
  async addSection(
    @Course() course: CourseEntity,
    @Body() createSectionDTO: CreateSectionDTO,
  ): Promise<{ newOrder: number[]; courseElement: CourseElementEntity }> {
    course = await this.courseService.findCourseWithElements(course.id, false);
    if (createSectionDTO.sectionParentId) {
      const section = await this.courseService.findSectionWithElements(course, createSectionDTO.sectionParentId, false);
      return await this.courseService.addSection(course, createSectionDTO, section);
    }

    return await this.courseService.addSection(course, createSectionDTO, null);
  }

  /**
   * Route to get the CourseElements at the top level of the course. Must have access to the course
   * @param course Course found with the id in the url
   * @param user User that tries to get the CourseElements of the course
   * @returns The top level CourseElements inside the course
   */
  @Get(':id/elements')
  @Auth()
  @UseGuards(CourseAccess)
  async getElements(@Course() course: CourseEntity, @User() user: UserEntity) {
    await this.userService.accessCourse(user, course);
    if (course.creator.id === user.id)
      return (await this.courseService.findCourseWithElements(course.id, false)).elements;
    return (await this.courseService.findCourseWithElements(course.id, true)).elements;
  }

  /**
   * Route to get the top level CourseElements inside a section in a course
   * @param course Course found with the id in the url
   * @param sectionId Id of the section the user wants to get the elements from
   * @param user User that tries to get the CourseElements of the section
   * @returns The top level CourseElements inside the section
   */
  @Get(':id/sections/:sectionId/elements')
  @Auth()
  @UseGuards(CourseAccess)
  async getElementsInSection(
    @Course() course: CourseEntity,
    @Param('sectionId') sectionId: string,
    @User() user: UserEntity,
  ) {
    await this.userService.accessCourse(user, course);
    if (course.creator.id === user.id)
      return (await this.courseService.findSectionWithElements(course, sectionId, false)).elements;
    return (await this.courseService.findSectionWithElements(course, sectionId, true)).elements;
  }

  /**
   * Route to create an activity directly inside a course or inside a section. And wraps
   * it in a CourseElement. Must be the creator of the course.
   * @param course Course found with the id in the url
   * @param createActivityDTO DTO of the activity to create
   * @returns The newly created CourseElement containing the activity and the updated order inside the section or course
   */
  @Post(':id/activities')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async addActivity(
    @Course() course: CourseEntity,
    @Body()
    createActivityDTO:
      | CreateActivityChallengeDTO
      | CreateActivityTheoryDTO
      | CreateActivityVideoDTO
      | CreateActivityPdfDTO
      | CreateActivityAssignmentDTO,
  ): Promise<{ newOrder: number[]; courseElement: CourseElementEntity }> {
    course = await this.courseService.findCourseWithElements(course.id, false);
    if (createActivityDTO.sectionParentId) {
      const section = await this.courseService.findSectionWithElements(
        course,
        createActivityDTO.sectionParentId,
        false,
      );
      return await this.courseService.addActivity(course, createActivityDTO, section);
    }

    return await this.courseService.addActivity(course, createActivityDTO, null);
  }

  /**
   * Route to update an activity by its id. Must be creator of the course
   * @param course Course found with the id in the url
   * @param activityId Id of the activity to update
   * @param updateActivityDTO DTO to update the activity with
   * @returns The newly updated activity
   */
  @Patch(':id/activities/:activityId')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async updateActivity(
    @Course() course: CourseEntity,
    @Param('activityId') activityId: string,
    @Body() updateActivityDTO: Partial<ActivityEntity>,
  ) {
    const activity = await this.courseService.findActivity(course.id, activityId);
    return await this.courseService.updateActivity(activity, updateActivityDTO);
  }

  /**
   * Moves an element from a parent into another parent with a positioning index.
   * Needs to be inside the same course!
   * @param course Course found with the id in the url
   * @param dto DTO to move an element inside a course (MoveElementDTO)
   */
  @Patch(':id/moveElement')
  @UseGuards(CourseAccess)
  async moveElement(@Course() course: CourseEntity, @Body() dto: MoveElementDTO) {
    const element = await this.courseService.findCourseElementWithParent(course, dto.elementId);
    let parent: CourseEntity | SectionEntity;
    if (isUUID(dto.parentId)) {
      if (dto.parentId !== course.id)
        throw new HttpException("Forbidden, can't move this element into another course", HttpStatus.FORBIDDEN);
      parent = await this.courseService.findOne(dto.parentId);
    } else {
      parent = await this.courseService.findSection(course, dto.parentId);
    }
    return await this.courseService.moveElement(course, element, parent, dto.index);
  }

  /**
   * Route to get a resource in an activity by its id. Must be creator of the course
   * @param course Course found with the id in the url
   * @param activityId Id of the activity to get the resource in
   * @returns The removal query result
   */
  @Get(':id/activities/:activityId/resources')
  @UseGuards(CourseAccess)
  async getResourceInActivity(@Course() course: CourseEntity, @Param('activityId') activityId: string) {
    const activity = await this.courseService.findActivity(course.id, activityId);
    return await this.courseService.getResourceOfActivity(activity);
  }

  /**
   * Route to download the file associated with an assignment activity.
   * @param course Course found with the id in the url
   * @param activityId Id of the activity to download the file from
   * @returns The file to download
   */
  @Get(':id/activities/:activityId/download')
  @UseGuards(CourseAccess)
  async downloadResourceFileInActivity(
    @Course() course: CourseEntity,
    @Param('activityId') activityId: string,
    @Res() res: Response,
  ) {
    const activity = await this.courseService.findActivity(course.id, activityId);
    const allowedActivitiesToDownloadFrom = [
      ACTIVITY_TYPE.ASSIGNMENT,
      ACTIVITY_TYPE.PDF,
      ACTIVITY_TYPE.POWERPOINT,
      ACTIVITY_TYPE.WORD,
    ];
    if (!allowedActivitiesToDownloadFrom.includes(activity.type))
      throw new HttpException(
        `Can only download on activities of type: ${allowedActivitiesToDownloadFrom.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    const resourceUnknown = await this.courseService.getResourceOfActivity(activity);
    if (resourceUnknown.type !== RESOURCE_TYPE.FILE)
      throw new HttpException(
        "The resource inside the activity is not of type FILE, can't download it",
        HttpStatus.BAD_REQUEST,
      );
    const resource = resourceUnknown as ResourceFileEntity;
    return res.status(200).download(`./uploads/resources/${resource.url}`);
  }

  /**
   * Route to get the file associated with an assignment activity.
   * @param course Course found with the id in the url
   * @param activityId Id of the activity to get the file from
   * @returns The file
   */
  @Get(':id/activities/:activityId/file')
  @UseGuards(CourseAccess)
  async getResourceFileInActivity(
    @Course() course: CourseEntity,
    @Param('activityId') activityId: string,
    @Res() res: Response,
  ) {
    const activity = await this.courseService.findActivity(course.id, activityId);
    const acceptedActivityTypes = [ACTIVITY_TYPE.PDF, ACTIVITY_TYPE.WORD];
    if (!acceptedActivityTypes.includes(activity.type))
      throw new HttpException(
        `Can only get the file on activities of type ${acceptedActivityTypes.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    const resource = await this.courseService.getResourceOfActivity(activity);
    return res.status(200).sendFile(resource.file.path, { root: '.' });
  }

  /**
   * Route to stream the file associated with a video activity.
   * @param id Id of the course to get the activity from
   * @param activityId Id of the activity to download the file from
   * @returns The video stream
   */
  @Get(':id/activities/:activityId/video')
  // @UseGuards(CourseAccess)
  async streamVideoResourceInActivity(
    @Param('id') id: string,
    @Param('activityId') activityId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const range = req.headers.range;
    if (!range) throw new HttpException('Missing range headers', HttpStatus.BAD_REQUEST);

    const activity = await this.courseService.findActivity(id, activityId);
    const resourceUnknown = await this.courseService.getResourceOfActivity(activity, true);
    if (resourceUnknown.type !== RESOURCE_TYPE.VIDEO)
      throw new HttpException(
        "The resource inside the activity is not of type VIDEO, can't download it",
        HttpStatus.BAD_REQUEST,
      );

    const resource = resourceUnknown as ResourceVideoEntity;
    const resourceUrl = `./uploads/resources/${resource.url}`;
    const videoSize = statSync(resourceUrl).size;

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': resource.file.mimetype,
    };

    res.writeHead(206, headers);

    const videoStream = createReadStream(resourceUrl, { start, end });
    videoStream.pipe(res);
  }

  /**
   * Route to add a resource to an activity by it's id. Must be creator of the course
   * @param course Course found with the id in the url
   * @param activityId Id of the activity to add the resource in
   * @returns The newly added resource
   */
  @Post(':id/activities/:activityId/addResource')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async addResourceToActivity(
    @Course() course: CourseEntity,
    @Param('activityId') activityId: string,
    @Body() addResourceDTO: AddResourceDTO,
    @User() professor: ProfessorEntity,
  ) {
    const activity = await this.courseService.findActivity(course.id, activityId);
    const resource = await this.resourceService.findOne(addResourceDTO.resourceId);
    if (resource.creator.id !== professor.id) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return await this.courseService.addResourceToActivity(activity, resource);
  }

  /**
   * Loads the challenge inside an activity
   * @param id Id of the course
   * @param activityId Id of the activity to load the challenge from
   * @returns Challenge
   */
  @Get(':id/activities/:activityId/loadChallenge')
  @Auth()
  @UseGuards(CourseAccess)
  async loadChallengeInActivity(@Param('id') id: string, @Param('activityId') activityId: string) {
    const act = await this.courseService.findActivity(id, activityId);
    if (act.type !== ACTIVITY_TYPE.CHALLENGE || !act.resourceId)
      throw new HttpException('Activity is not of type challenge or has no resource', HttpStatus.BAD_REQUEST);
    const res = await this.resourceService.findOne(act.resourceId);
    if (res.type !== RESOURCE_TYPE.CHALLENGE)
      throw new HttpException('Resource has no challenge', HttpStatus.BAD_REQUEST);
    return await this.challengeService.findOne((res as any as ResourceChallengeEntity).challengeId);
  }

  /**
   * Route to remove a resource from an activity by it's id. Must be creator of the course
   * @param course Course found with the id in the url
   * @param activityId Id of the activity to remove the resource from
   * @returns The updated activity
   */
  @Delete(':id/activities/:activityId/removeResource')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async removeResourceFromActivity(@Course() course: CourseEntity, @Param('activityId') activityId: string) {
    const activity = await this.courseService.findActivity(course.id, activityId);
    return await this.courseService.removeResourceFromActivity(activity);
  }

  /**
   * Route to delete a CourseElement by it's id. Deletes the activity
   * or section contained in it at the same time
   * @param course Course found with the id in the url
   * @param courseElementId Id of the CourseElement to delete
   * @returns The result of the deletion
   */
  @Delete(':id/elements/:courseElementId')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async deleteCourseElement(@Course() course: CourseEntity, @Param('courseElementId') courseElementId: string) {
    const courseElement = await this.courseService.findCourseElementWithParent(course, courseElementId);
    return await this.courseService.deleteCourseElement(courseElement);
  }

  /**
   * Route to update a CourseElement by it's id.
   * @param course Course found with the id in the url
   * @param courseElementId Id of the CourseElement to delete
   * @param dto
   * @returns The updated CourseElement
   */
  @Patch(':id/elements/:courseElementId')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async updateCourseElement(
    @Course() course: CourseEntity,
    @Param('courseElementId') courseElementId: string,
    @Body() dto: UpdateCourseElementDTO,
  ) {
    const courseElement = await this.courseService.findCourseElement(course, courseElementId);
    return await this.courseService.updateCourseElement(course, courseElement, dto);
  }
}
