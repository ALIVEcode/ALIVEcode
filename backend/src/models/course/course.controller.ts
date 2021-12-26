import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseEntity } from './entities/course.entity';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { SectionEntity } from './entities/section.entity';
import { ProfessorEntity } from '../user/entities/professor.entity';
import { UserEntity } from '../user/entities/user.entity';
import { hasRole } from '../user/auth';
import { Role } from '../../utils/types/roles.types';
import { Auth } from '../../utils/decorators/auth.decorator';
import { User } from '../../utils/decorators/user.decorator';
import { ActivityEntity } from './entities/activity.entity';
import { CreateCourseDTO } from './dtos/CreateCourseDTO';

@Controller('courses')
@UseInterceptors(DTOInterceptor)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Auth(Role.PROFESSOR)
  async create(@User() user: ProfessorEntity, @Body() createCourseDto: CreateCourseDTO) {
    return await this.courseService.create(user, createCourseDto);
  }

  @Get()
  @Auth(Role.STAFF)
  async findAll() {
    return await this.courseService.findAll();
  }

  // TODO : decide of a good way to manage errors (ex: totally hide the fact that the access
  // is denied by saying not found?)
  @Get(':id')
  @Auth()
  async findOne(@User() user: UserEntity, @Param('id') id: string, @Query('code') code: string) {
    const course = await this.courseService.findOne(id);
    await this.courseService.filterCourseAccess(course, user);

    return course;
  }

  // TODO : add repetive code as a guard
  @Patch(':id')
  @Auth(Role.PROFESSOR, Role.STAFF)
  async update(@User() user: UserEntity, @Param('id') id: string, @Body() updateCourseDto: CourseEntity) {
    const course = await this.courseService.findOne(id);
    if (course.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @Auth(Role.PROFESSOR, Role.STAFF)
  async remove(@User() user: UserEntity, @Param('id') id: string) {
    const course = await this.courseService.findOne(id);
    if (course.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.courseService.remove(course);
  }

  @Post(':id/sections')
  @Auth(Role.PROFESSOR)
  async createSection(@User() user: ProfessorEntity, @Param('id') id: string, @Body() createSectionDTO: SectionEntity) {
    const course = await this.courseService.findOne(id);
    if (course.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.courseService.createSection(course.id, createSectionDTO);
  }

  @Delete(':id/sections/:sectionId')
  @Auth(Role.PROFESSOR, Role.STAFF)
  async removeSection(@User() user: UserEntity, @Param('id') id: string, @Param('sectionId') sectionId: string) {
    const course = await this.courseService.findOne(id);
    if (course.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.courseService.removeSection(id, sectionId);
  }

  @Get(':id/sections')
  @Auth()
  async getSections(@User() user: UserEntity, @Param('id') id: string) {
    const course = await this.courseService.findOne(id);
    await this.courseService.filterCourseAccess(course, user);

    return await this.courseService.getSections(id);
  }

  @Get(':id/sections/:sectionId/activities')
  @Auth()
  async getActivities(@User() user: UserEntity, @Param('id') id: string, @Param('sectionId') sectionId: string) {
    const course = await this.courseService.findOne(id);
    await this.courseService.filterCourseAccess(course, user);

    return await this.courseService.getActivities(id, sectionId);
  }

  @Post(':id/sections/:sectionId/activities')
  @Auth(Role.PROFESSOR)
  async addActivity(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Body() createActivityDTO: ActivityEntity,
  ) {
    const course = await this.courseService.findOne(id);
    if (course.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.courseService.addActivity(id, sectionId, createActivityDTO);
  }

  @Get(':id/sections/:sectionId/activities/:activityId/content')
  @Auth()
  async getActivityContent(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Param('activityId') activityId: string,
  ) {
    const course = await this.courseService.findOne(id);
    await this.courseService.filterCourseAccess(course, user);

    return await this.courseService.findActivity(id, sectionId, activityId);
  }

  @Patch(':id/sections/:sectionId/activities/:activityId/content')
  @Auth(Role.PROFESSOR)
  async updateActivity(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Param('activityId') activityId: string,
    @Body() updateActivityDTO: Partial<ActivityEntity>,
  ) {
    const course = await this.courseService.findOne(id);
    if (course.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.courseService.updateActivity(id, sectionId, activityId, updateActivityDTO);
  }

  @Delete(':id/sections/:sectionId/activities/:activityId')
  @Auth()
  async removeActivity(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Param('sectionId') sectionId: string,
    @Param('activityId') activityId: string,
  ) {
    const course = await this.courseService.findOne(id);
    if (course.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.courseService.removeActivity(id, sectionId, activityId);
  }
}
