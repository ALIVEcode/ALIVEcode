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
import { IoTProjectAddRouteScriptDTO, IoTProjectAddScriptDTO } from './dto/addScript.dto';
import { IoTProjectUpdateDTO } from './dto/updateProject.dto';
import { IoTProjectService } from './IoTproject.service';
import { IoTObjectService } from '../IoTobject/IoTobject.service';
import { IoTProjectCreator } from '../../../utils/guards/iotProject.guard';
import { IoTProject } from '../../../utils/decorators/iotProject.decorator';
import { AsScriptService } from '../../as-script/as-script.service';

@Controller('iot/projects')
@UseInterceptors(DTOInterceptor)
export class IoTProjectController {
  constructor(
    private readonly projectService: IoTProjectService,
    private readonly objectService: IoTObjectService,
    private readonly asService: AsScriptService,
  ) {}

  @Post()
  @Auth()
  async create(@User() user: UserEntity, @Body() createIoTobjectDto: IoTProjectEntity) {
    return await this.projectService.create(user, createIoTobjectDto);
  }

  @Get()
  @Auth(Role.STAFF)
  async findAll() {
    return await this.projectService.findAll();
  }

  @Get(':id')
  @Auth()
  async findOne(@User() user: UserEntity, @Param('id') id: string) {
    const project = await this.projectService.findOne(id);

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
    return await this.projectService.update(id, updateIoTobjectDto);
  }

  @Delete(':id')
  @Auth()
  @UseGuards(IoTProjectCreator)
  async remove(@Param('id') id: string) {
    return await this.projectService.remove(id);
  }

  @Patch(':id/layout')
  @Auth()
  @UseGuards(IoTProjectCreator)
  async updateLayout(@Param('id') id: string, @Body() layout: IoTProjectLayout) {
    return await this.projectService.updateLayout(id, layout);
  }

  @Patch(':id/document')
  @Auth()
  @UseGuards(IoTProjectCreator)
  async updateDocument(@Param('id') id: string, @Body() document: IoTProjectDocument) {
    if (typeof document !== 'object') throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    return await this.projectService.setDocument(id, document);
  }

  @Get(':id/routes')
  @Auth()
  async getRoutes(@User() user: UserEntity, @Param('id') id: string) {
    const project = await this.projectService.findOne(id);

    if (project.creator.id === user.id || hasRole(user, Role.STAFF))
      return await this.projectService.getRoutes(project);
    if (project.access === IOTPROJECT_ACCESS.PRIVATE) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // TODO : Add restriction
    if (project.access === IOTPROJECT_ACCESS.RESTRICTED) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return await this.projectService.getRoutes(project);
  }

  @Post(':id/routes')
  @Auth()
  @UseGuards(IoTProjectCreator)
  async addRoute(@IoTProject() project: IoTProjectEntity, @Body() routeDTO: IoTRouteEntity) {
    return await this.projectService.addRoute(project, routeDTO);
  }

  @Get(':id/objects')
  @Auth()
  async getObjects(@User() user: UserEntity, @Param('id') id: string) {
    const project = await this.projectService.findOne(id);

    if (project.creator.id === user.id || hasRole(user, Role.STAFF))
      return await this.projectService.getObjects(project);
    if (project.access === IOTPROJECT_ACCESS.PRIVATE) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // TODO : Add restriction
    if (project.access === IOTPROJECT_ACCESS.RESTRICTED) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return await this.projectService.getObjects(project);
  }

  @Post(':id/objects')
  @Auth()
  @UseGuards(IoTProjectCreator)
  async addObject(@IoTProject() project: IoTProjectEntity, @Body() addObjectDTO: AddObjectDTO) {
    const object = await this.objectService.findOne(addObjectDTO.id);
    return await this.projectService.addObject(project, object);
  }

  @Post(':id/createRouteScript')
  @Auth()
  @UseGuards(IoTProjectCreator)
  async addAndCreateRouteScript(
    @IoTProject() project: IoTProjectEntity,
    @User() user: UserEntity,
    @Body() dto: IoTProjectAddRouteScriptDTO,
  ) {
    const script = await this.asService.create(user, dto.script);
    return await this.projectService.addScriptToRoute(project, dto.routeId, script);
  }

  @Post(':id/createScript')
  @Auth()
  @UseGuards(IoTProjectCreator)
  async addAndCreateScript(
    @IoTProject() project: IoTProjectEntity,
    @User() user: UserEntity,
    @Body() dto: IoTProjectAddScriptDTO,
  ) {
    dto.script.iotProject = project;
    const script = await this.asService.create(user, dto.script);
    return await this.projectService.addScriptToProject(project, script);
  }

  @Get(':id/scripts')
  @Auth()
  async getScripts(@User() user: UserEntity, @Param('id') id: string) {
    const project = await this.projectService.findOne(id);

    if (project.creator.id === user.id || hasRole(user, Role.STAFF))
      return await this.projectService.getScripts(project);
    if (project.access === IOTPROJECT_ACCESS.PRIVATE) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // TODO : Add restriction`
    if (project.access === IOTPROJECT_ACCESS.RESTRICTED) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.projectService.getScripts(project);
  }
}
