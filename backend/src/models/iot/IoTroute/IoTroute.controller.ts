import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  UseInterceptors,
} from '@nestjs/common';
import { IoTRouteService } from './IoTroute.service';
import { Auth } from '../../../utils/decorators/auth.decorator';
import { User } from '../../../utils/decorators/user.decorator';
import { Role } from '../../../utils/types/roles.types';
import { IoTRouteEntity } from './entities/IoTroute.entity';
import { IoTProjectService } from '../IoTproject/IoTproject.service';
import { UserEntity } from '../../user/entities/user.entity';
import { DTOInterceptor } from '../../../utils/interceptors/dto.interceptor';
import { hasRole } from '../../user/auth';

@Controller('iot/routes')
@UseInterceptors(DTOInterceptor)
export class IoTRouteController {
  constructor(private readonly routeService: IoTRouteService, private readonly projectService: IoTProjectService) {}

  @Post('projects/:id/routes')
  @Auth()
  async create(@User() user: UserEntity, @Param('id') id: string, @Body() createIoTobjectDto: IoTRouteEntity) {
    const project = await this.projectService.findOne(id);
    if (project.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return await this.routeService.create(project, createIoTobjectDto);
  }

  @Get('projects/:id/routes')
  @Auth(Role.STAFF)
  async findAll() {
    return await this.routeService.findAll();
  }

  @Get('projects/:id/routes')
  @Auth(Role.STAFF)
  async findOne(@Param('id') id: string) {
    return await this.routeService.findOne(id);
  }

  @Patch('projects/:projectId/:id')
  @Auth()
  async update(
    @User() user: UserEntity,
    @Param('projectId') projectId: string,
    @Param('id') id: string,
    @Body() updateIoTobjectDto: IoTRouteEntity,
  ) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const project = await this.projectService.findOne(projectId);
    if (project.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.routeService.update(id, updateIoTobjectDto);
  }

  @Delete('projects/:projectId/:id')
  @Auth()
  async remove(@User() user: UserEntity, @Param('projectId') projectId: string, @Param('id') id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const project = await this.projectService.findOne(projectId);
    if (project.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.routeService.remove(id);
  }
}
