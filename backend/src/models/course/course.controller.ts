import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { Auth } from '../../utils/decorators/auth.decorator';
import { Course } from '../../utils/decorators/course.decorator';
import { User } from '../../utils/decorators/user.decorator';
import { CourseAccess, CourseProfessor } from '../../utils/guards/course.guard';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { Role } from '../../utils/types/roles.types';
import { ProfessorEntity, UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CourseService } from './course.service';
import { CreateCourseDTO } from './dtos/CreateCourseDTO';
import { ActivityEntity } from './entities/activity.entity';
import { CourseEntity } from './entities/course.entity';
import { CreateSectionDTO } from './dtos/CreateSectionDTO';
import { CreateActivityTheoryDTO, CreateActivityLevelDTO, CreateActivityVideoDTO } from './dtos/CreateActivitiesDTO';

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
  @UseGuards(CourseProfessor)
  @Auth(Role.PROFESSOR, Role.STAFF)
  async addSection(@Course() course: CourseEntity, @Body() createSectionDTO: CreateSectionDTO) {
    course = await this.courseService.findOneWithElements(course.id);
    if (createSectionDTO.sectionParentId) {
      const section = await this.courseService.findSectionWithElements(createSectionDTO.sectionParentId);
      return await this.courseService.addSection(course, createSectionDTO.courseContent, section);
    }

    return await this.courseService.addSection(course, createSectionDTO.courseContent);
  }

  @Get(':id/elements')
  @Auth()
  @UseGuards(CourseAccess)
  async getElements(@Course() course: CourseEntity, @User() user: UserEntity) {
    await this.userService.accessCourse(user, course);
    return (await this.courseService.findOneWithElements(course.id)).elements;
  }

  @Get(':id/sections/:sectionId/elements')
  @Auth()
  @UseGuards(CourseAccess)
  async getElementsInSection(
    @Course() course: CourseEntity,
    @Param('sectionId') sectionId: string,
    @User() user: UserEntity,
  ) {
    await this.userService.accessCourse(user, course);
    return (await this.courseService.findSectionWithElements(sectionId)).elements;
  }

  @Post(':id/activities')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async addActivity(
    @Course() course: CourseEntity,
    @Body() createActivityDTO: CreateActivityLevelDTO | CreateActivityTheoryDTO | CreateActivityVideoDTO,
  ) {
    course = await this.courseService.findOneWithElements(course.id);
    if (createActivityDTO.sectionParentId) {
      const section = await this.courseService.findSectionWithElements(createActivityDTO.sectionParentId);
      return await this.courseService.addActivity(course, createActivityDTO.courseContent, section);
    }

    return await this.courseService.addActivity(course, createActivityDTO.courseContent);
  }

  @Get(':id/activities/:activityId/content')
  @Auth()
  @UseGuards(CourseAccess)
  async getActivityContent(@Course() course: CourseEntity, @Param('activityId') activityId: string) {
    return await this.courseService.findActivity(course.id, activityId);
  }

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

  @Delete(':id/elements/:courseElementId')
  @Auth(Role.PROFESSOR, Role.STAFF)
  @UseGuards(CourseProfessor)
  async deleteCourseElement(@Course() course: CourseEntity, @Param('courseElementId') courseElementId: string) {
    const courseElement = await this.courseService.findCourseElement(course, courseElementId);
    return await this.courseService.deleteCourseElement(courseElement);
  }
}
