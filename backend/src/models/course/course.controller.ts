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
  UploadedFile,
} from '@nestjs/common';
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
} from './dtos/CreateActivities.dto';
import { CreateCourseDTO } from './dtos/CreateCourse.dto';
import { CreateSectionDTO } from './dtos/CreateSection.dto';
import { ActivityEntity } from './entities/activity.entity';
import { CourseEntity } from './entities/course.entity';
import { CourseElementEntity } from './entities/course_element.entity';
import { UpdateCourseElementDTO } from './dtos/UpdateCourseElement.dto';
import { AddResourceDTO } from './dtos/AddResource.dto';
import { ResourceService } from '../resource/resource.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MyRequest } from 'src/utils/guards/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

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
    course = await this.courseService.findOneWithElements(course.id);
    if (createSectionDTO.sectionParentId) {
      const section = await this.courseService.findSectionWithElements(course, createSectionDTO.sectionParentId);
      return await this.courseService.addSection(course, createSectionDTO, section);
    }

    return await this.courseService.addSection(course, createSectionDTO);
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
    return (await this.courseService.findOneWithElements(course.id)).elements;
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
    return (await this.courseService.findSectionWithElements(course, sectionId)).elements;
  }

  /**
   * Route to create an activity directly inside a course or inside a section. And wraps
   * it in a CourseElement. Must be the creator of the course.
   * @param course Course found with with the id in the url
   * @param createActivityDTO DTO of the activity to create
   * @returns The newly created CourseElement containing the activity and the updated order inside the section or course
   */
  @Post(':id/activities')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async addActivity(
    @Course() course: CourseEntity,
    @Body() createActivityDTO: CreateActivityChallengeDTO | CreateActivityTheoryDTO | CreateActivityVideoDTO,
  ): Promise<{ newOrder: number[]; courseElement: CourseElementEntity }> {
    course = await this.courseService.findOneWithElements(course.id);
    if (createActivityDTO.sectionParentId) {
      const section = await this.courseService.findSectionWithElements(course, createActivityDTO.sectionParentId);
      return await this.courseService.addActivity(course, createActivityDTO, section);
    }

    return await this.courseService.addActivity(course, createActivityDTO);
  }

  /**
   * Route to get the content of an activity (non-generic fields of a specific type
   * of activity). Must have access to the course
   * @param course Course found with the id in the url
   * @param activityId Id of the activity you want to get the content from
   * @returns The content of the specified activity
   */
  @Get(':id/activities/:activityId/content')
  @Auth()
  @UseGuards(CourseAccess)
  async getActivityContent(@Course() course: CourseEntity, @Param('activityId') activityId: string) {
    return await this.courseService.findActivityWithContentLoaded(course.id, activityId);
  }

  /**
   * Route to update an activity by it's id. Must be creator of the course
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
   * Route to add a resource to an activity by it's id. Must be creator of the course
   * @param course Course found with the id in the url
   * @param activityId Id of the activity to add the resource in
   * @returns The newly updated activity
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
    return await this.courseService.updateCourseElement(courseElement, dto);
  }
}
