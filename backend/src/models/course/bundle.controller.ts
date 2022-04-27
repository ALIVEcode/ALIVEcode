import { Controller, Get, UseInterceptors, Param, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { UserService } from '../user/user.service';
import { CourseService } from './course.service';
import { ResourceService } from '../resource/resource.service';
import { Auth } from '../../utils/decorators/auth.decorator';
import { BundleService } from './bundle.service';
import { Role } from '../../utils/types/roles.types';
import { User } from '../../utils/decorators/user.decorator';
import { ProfessorEntity } from '../user/entities/user.entity';
import { CreateCourseDTO } from './dtos/CreateCourse.dto';
import { QueryDTO } from '../challenge/dto/query.dto';

/**
 * All the routes for the bundles
 * @author Enric Soldevila
 */
@Controller('bundles')
@ApiTags('bundles')
@UseInterceptors(DTOInterceptor)
@Auth(Role.PROFESSOR)
export class BundleController {
  constructor(
    private readonly bundleService: BundleService,
    private readonly courseService: CourseService,
    private readonly userService: UserService,
    private readonly resourceService: ResourceService,
  ) {}

  @Post('query')
  @Auth()
  async findQuery(@Body() query: QueryDTO) {
    return await this.bundleService.findQuery(query);
  }

  @Get('courseTemplates')
  async getCourseTemplates(@User() professor: ProfessorEntity) {
    return await this.bundleService.getOwnedAndPublicTemplates(professor);
  }

  @Post('courseTemplates/:id/createCourse')
  async createCourseFromTemplate(
    @Param('id') id: string,
    @User() professor: ProfessorEntity,
    @Body() createCourseDto: CreateCourseDTO,
  ) {
    const template = await this.bundleService.findTemplate(id, professor);
    return await this.bundleService.createCourseFromTemplate(template, professor, createCourseDto);
  }
}