import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseEntity } from './entities/course.entity';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { SectionEntity } from './entities/section.entity';
import { ProfessorEntity } from '../user/entities/user.entity';
import { UserEntity } from '../user/entities/user.entity';
import { Role } from '../../utils/types/roles.types';
import { Auth } from '../../utils/decorators/auth.decorator';
import { User } from '../../utils/decorators/user.decorator';
import { CreateCourseDTO } from './dtos/CreateCourseDTO';
import { UserService } from '../user/user.service';
import { ActivityEntity } from './entities/activity.entity';
import { Course } from '../../utils/decorators/course.decorator';
import { CourseProfessor, CourseAccess } from '../../utils/guards/course.guard';
import { CreateActivityLevelDTO, CreateActivityTheoryDTO, CreateActivityVideoDTO } from './dtos/CreateActivitiesDTO';

@Controller('courses')
@UseInterceptors(DTOInterceptor)
export class CourseController {
  constructor(private readonly courseService: CourseService, private readonly userService: UserService) {}

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
  @UseGuards(CourseAccess)
  async findOne(@Course() course: CourseEntity) {
    return course;
  }

  @Patch(':id')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async update(@Course() course: CourseEntity, @Body() updateCourseDto: CourseEntity) {
    return await this.courseService.update(course.id, updateCourseDto);
  }

  @Delete(':id')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async remove(@Course() course: CourseEntity) {
    return await this.courseService.remove(course);
  }

  @Post(':id/sections')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async createSection(@Course() course: CourseEntity, @Body() createSectionDTO: SectionEntity) {
    return await this.courseService.createSection(course.id, createSectionDTO);
  }

  @Delete(':id/sections/:sectionId')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async removeSection(@Course() course: CourseEntity, @Param('sectionId') sectionId: string) {
    return await this.courseService.removeSection(sectionId);
  }

  @Get(':id/elements')
  @Auth()
  @UseGuards(CourseAccess)
  async getSections(@Course() course: CourseEntity, @User() user: UserEntity) {
    await this.userService.accessCourse(user, course);
    return (await this.courseService.findOneWithElements(course.id)).elements;
  }

  @Get(':id/sections/:sectionId/elements')
  @Auth()
  @UseGuards(CourseAccess)
  async getActivities(@Course() course: CourseEntity, @Param('sectionId') sectionId: string) {
    return (await this.courseService.findSectionWithElements(sectionId)).elements;
  }

  @Post(':id/sections/:sectionId/elements')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async addActivity(
    @Course() course: CourseEntity,
    @Param('sectionId') sectionId: string,
    @Body() createActivityDTO: CreateActivityLevelDTO | CreateActivityTheoryDTO | CreateActivityVideoDTO,
  ) {
    return await this.courseService.createActivity(sectionId, createActivityDTO);
  }

  @Get(':id/sections/:sectionId/activities/:activityId/content')
  @Auth()
  @UseGuards(CourseAccess)
  async getActivityContent(
    @Course() course: CourseEntity,
    @Param('sectionId') sectionId: string,
    @Param('activityId') activityId: string,
  ) {
    return await this.courseService.findActivity(course.id, sectionId, activityId);
  }

  @Patch(':id/sections/:sectionId/activities/:activityId/content')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async updateActivity(
    @Course() course: CourseEntity,
    @Param('sectionId') sectionId: string,
    @Param('activityId') activityId: string,
    @Body() updateActivityDTO: Partial<ActivityEntity>,
  ) {
    return await this.courseService.updateActivity(course.id, sectionId, activityId, updateActivityDTO);
  }

  @Delete(':id/sections/:sectionId/activities/:activityId')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async removeActivity(
    @Course() course: CourseEntity,
    @Param('sectionId') sectionId: string,
    @Param('activityId') activityId: string,
  ) {
    return await this.courseService.removeActivity(activityId);
  }
}
