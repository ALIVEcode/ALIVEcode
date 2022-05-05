import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { IoTObjectEntity } from './entities/IoTobject.entity';
import { Auth } from '../../../utils/decorators/auth.decorator';
import { IoTObjectService } from './IoTobject.service';
import { UserEntity } from '../../user/entities/user.entity';
import { DTOInterceptor } from '../../../utils/interceptors/dto.interceptor';
import { hasRole } from '../../user/auth';
import { User } from '../../../utils/decorators/user.decorator';
import { Role } from '../../../utils/types/roles.types';
import { ConnectionObjectToProjectDTO } from './dto/AssignObjectToProject.dto';
import { IoTProjectService } from '../IoTproject/IoTproject.service';

@Controller('iot/objects')
@UseInterceptors(DTOInterceptor)
export class IoTObjectController {
  constructor(private readonly objectService: IoTObjectService, private projectService: IoTProjectService) {}

  @Post()
  @Auth()
  async create(@User() user: UserEntity, @Body() createIoTobjectDto: IoTObjectEntity) {
    return await this.objectService.create(user, createIoTobjectDto);
  }

  @Get()
  @Auth(Role.STAFF)
  async findAll() {
    return await this.objectService.findAll();
  }

  @Get(':id')
  @Auth()
  async findOne(@User() user: UserEntity, @Param('id') id: string) {
    const project = await this.objectService.findOne(id);

    if (project.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return project;
  }

  @Patch(':id')
  @Auth()
  async update(@User() user: UserEntity, @Param('id') id: string, @Body() updateIoTobjectDto: IoTObjectEntity) {
    const IoTObject = await this.objectService.findOne(id);
    if (IoTObject.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.objectService.update(IoTObject.id, updateIoTobjectDto);
  }

  @Delete(':id')
  @Auth()
  async remove(@User() user: UserEntity, @Param('id') id: string) {
    const IoTObject = await this.objectService.findOne(id);
    if (IoTObject.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.objectService.remove(id);
  }

  @Patch(':id/connectProject')
  async assignProject(@Param('id') id: string, @User() user: UserEntity, @Body() dto: ConnectionObjectToProjectDTO) {
    const object = await this.objectService.findOne(id);
    const project = await this.projectService.findOne(dto.projectId);

    if (!hasRole(user, Role.STAFF) && (object.creator.id !== user.id || project.creator.id !== user.id))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.objectService.connectToProject(object, project);
  }

  @Patch(':id/disconnectProject')
  async disconnectProject(
    @Param('id') id: string,
    @User() user: UserEntity,
    @Body() dto: ConnectionObjectToProjectDTO,
  ) {
    const object = await this.objectService.findOne(id);
    const project = await this.projectService.findOne(dto.projectId);

    if (!hasRole(user, Role.STAFF) && project.creator.id !== user.id)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.objectService.disconnectFromProject(object, project);
  }
}
