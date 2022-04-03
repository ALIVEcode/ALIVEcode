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
  UseGuards,
} from '@nestjs/common';
import { Auth } from '../../../utils/decorators/auth.decorator';
import { User } from '../../../utils/decorators/user.decorator';
import { Role } from '../../../utils/types/roles.types';
import {
  IoTProjectDocument,
  IoTProjectEntity,
  IoTProjectLayout,
  IOTPROJECT_ACCESS,
} from './entities/IoTproject.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { DTOInterceptor } from '../../../utils/interceptors/dto.interceptor';
import { IoTRouteEntity } from '../IoTroute/entities/IoTroute.entity';
import { hasRole } from '../../user/auth';
import { AddObjectDTO } from './dto/addObject.dto';
import { IoTProjectAddScriptDTO } from './dto/addScript.dto';
import { IoTProjectUpdateDTO } from './dto/updateProject.dto';
import { IoTProjectService } from './IoTproject.service';
import { IoTObjectService } from '../IoTobject/IoTobject.service';
import { IoTProjectCreator } from '../../../utils/guards/iotProject.guard';
import { IoTProject } from '../../../utils/decorators/iotProject.decorator';

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
  @UseGuards(IoTProjectCreator)
  async update(@Param('id') id: string, @Body() updateIoTobjectDto: IoTProjectUpdateDTO) {
    return await this.IoTProjectService.update(id, updateIoTobjectDto);
  }

  @Delete(':id')
  @Auth()
  @UseGuards(IoTProjectCreator)
  async remove(@Param('id') id: string) {
    return await this.IoTProjectService.remove(id);
  }

  @Patch(':id/layout')
  @Auth()
  @UseGuards(IoTProjectCreator)
  async updateLayout(@Param('id') id: string, @Body() layout: IoTProjectLayout) {
    return await this.IoTProjectService.updateLayout(id, layout);
  }

  @Patch(':id/document')
  @Auth()
  @UseGuards(IoTProjectCreator)
  async updateDocument(@Param('id') id: string, @Body() document: IoTProjectDocument) {
    if (typeof document !== 'object') throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    return await this.IoTProjectService.setDocument(id, document);
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
  @UseGuards(IoTProjectCreator)
  async addRoute(@IoTProject() project: IoTProjectEntity, @Body() routeDTO: IoTRouteEntity) {
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
  @UseGuards(IoTProjectCreator)
  async addObject(@IoTProject() project: IoTProjectEntity, @Body() addObjectDTO: AddObjectDTO) {
    const object = await this.IoTObjectService.findOne(addObjectDTO.id);
    return await this.IoTProjectService.addObject(project, object);
  }

  @Post(':id/as/create')
  @Auth()
  @UseGuards(IoTProjectCreator)
  async addAndCreateScript(
    @IoTProject() project: IoTProjectEntity,
    @User() user: UserEntity,
    @Body() scriptDTO: IoTProjectAddScriptDTO,
  ) {
    return await this.IoTProjectService.addScript(project, user, scriptDTO);
  }
}
