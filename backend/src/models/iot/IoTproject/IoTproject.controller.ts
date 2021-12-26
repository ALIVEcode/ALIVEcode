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
import { Auth } from '../../../utils/decorators/auth.decorator';
import { User } from '../../../utils/decorators/user.decorator';
import { Role } from '../../../utils/types/roles.types';
import { IoTProjectEntity, IoTProjectLayout, IOTPROJECT_ACCESS } from './entities/IoTproject.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { DTOInterceptor } from '../../../utils/interceptors/dto.interceptor';
import { IoTRouteEntity } from '../IoTroute/entities/IoTroute.entity';
import { hasRole } from '../../user/auth';
import { AddObjectDTO } from './dto/addObject.dto';
import { IoTProjectService } from './IoTproject.service';
import { IoTObjectService } from '../IoTobject/IoTobject.service';
import { IoTProjectAddScriptDTO } from './dto/addScript.dto';

@Controller('iot/projects')
@UseInterceptors(DTOInterceptor)
export class IoTProjectController {
  constructor(
    private readonly IoTProjectService: IoTProjectService,
    private readonly IoTObjectService: IoTObjectService,
  ) {}

  @Post()
  @Auth()
  async create(@User() user: UserEntity, @Body() createIoTobjectDto: IoTProjectEntity) {
    return await this.IoTProjectService.create(user, createIoTobjectDto);
  }

  @Get()
  @Auth(Role.STAFF)
  async findAll() {
    return await this.IoTProjectService.findAll();
  }

  @Get(':id')
  @Auth()
  async findOne(@User() user: UserEntity, @Param('id') id: string) {
    const project = await this.IoTProjectService.findOne(id);

    if (project.creator.id === user.id || hasRole(user, Role.STAFF)) return project;
    if (project.access === IOTPROJECT_ACCESS.PRIVATE) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // TODO : Add restriction
    if (project.access === IOTPROJECT_ACCESS.RESTRICTED) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return project;
  }

  @Patch(':id')
  @Auth()
  async update(@User() user: UserEntity, @Param('id') id: string, @Body() updateIoTobjectDto: IoTProjectEntity) {
    const project = await this.IoTProjectService.findOne(id);

    if (project.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.IoTProjectService.update(project.id, updateIoTobjectDto);
  }

  @Delete(':id')
  @Auth()
  async remove(@User() user: UserEntity, @Param('id') id: string) {
    const project = await this.IoTProjectService.findOne(id);

    if (project.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.IoTProjectService.remove(id);
  }

  @Patch(':id/layout')
  @Auth()
  async updateLayout(@User() user: UserEntity, @Param('id') id: string, @Body() layout: IoTProjectLayout) {
    const project = await this.IoTProjectService.findOne(id);

    if (project.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.IoTProjectService.updateLayout(id, layout);
  }

  @Get(':id/routes')
  @Auth()
  async getRoutes(@User() user: UserEntity, @Param('id') id: string) {
    const project = await this.IoTProjectService.findOne(id);

    if (project.creator.id === user.id || hasRole(user, Role.STAFF))
      return await this.IoTProjectService.getRoutes(project);
    if (project.access === IOTPROJECT_ACCESS.PRIVATE) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // TODO : Add restriction
    if (project.access === IOTPROJECT_ACCESS.RESTRICTED) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return await this.IoTProjectService.getRoutes(project);
  }

  @Post(':id/routes')
  @Auth()
  async addRoute(@User() user: UserEntity, @Param('id') id: string, @Body() routeDTO: IoTRouteEntity) {
    const project = await this.IoTProjectService.findOne(id);

    if (project.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.IoTProjectService.addRoute(project, routeDTO);
  }

  @Get(':id/objects')
  @Auth()
  async getObjects(@User() user: UserEntity, @Param('id') id: string) {
    const project = await this.IoTProjectService.findOne(id);

    if (project.creator.id === user.id || hasRole(user, Role.STAFF))
      return await this.IoTProjectService.getObjects(project);
    if (project.access === IOTPROJECT_ACCESS.PRIVATE) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // TODO : Add restriction
    if (project.access === IOTPROJECT_ACCESS.RESTRICTED) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return await this.IoTProjectService.getObjects(project);
  }

  @Post(':id/objects')
  @Auth()
  async addObject(@User() user: UserEntity, @Param('id') id: string, @Body() addObjectDTO: AddObjectDTO) {
    const project = await this.IoTProjectService.findOne(id);

    if (project.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    const object = await this.IoTObjectService.findOne(addObjectDTO.id);
    return await this.IoTProjectService.addObject(project, object);
  }

  @Post(':id/as/create')
  @Auth()
  async addAndCreateScript(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() scriptDTO: IoTProjectAddScriptDTO,
  ) {
    const project = await this.IoTProjectService.findOne(id);

    if (project.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.IoTProjectService.addScript(project, user, scriptDTO);
  }
}
