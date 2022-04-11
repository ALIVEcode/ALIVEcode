import { Controller, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { UserService } from '../user/user.service';
import { CourseService } from './course.service';
import { ResourceService } from '../resource/resource.service';

/**
 * All the routes for the bundles
 * @author Enric Soldevila
 */
@Controller('bundles')
@ApiTags('bundles')
@UseInterceptors(DTOInterceptor)
export class BundleController {
  constructor(
    private readonly courseService: CourseService,
    private readonly userService: UserService,
    private readonly resourceService: ResourceService,
  ) {}
}