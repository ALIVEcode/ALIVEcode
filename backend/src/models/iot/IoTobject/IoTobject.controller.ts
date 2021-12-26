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

@Controller('iot/objects')
@UseInterceptors(DTOInterceptor)
export class IoTObjectController {
  constructor(private readonly IoTObjectService: IoTObjectService) {}

  @Post()
  @Auth()
  async create(@User() user: UserEntity, @Body() createIoTobjectDto: IoTObjectEntity) {
    return await this.IoTObjectService.create(user, createIoTobjectDto);
  }

  @Get()
  @Auth(Role.STAFF)
  async findAll() {
    return await this.IoTObjectService.findAll();
  }

  @Get(':id')
  @Auth()
  async findOne(@User() user: UserEntity, @Param('id') id: string) {
    const project = await this.IoTObjectService.findOne(id);

    if (project.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return project;
  }

  @Patch(':id')
  @Auth()
  async update(@User() user: UserEntity, @Param('id') id: string, @Body() updateIoTobjectDto: IoTObjectEntity) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const IoTObject = await this.IoTObjectService.findOne(id);
    if (IoTObject.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.IoTObjectService.update(IoTObject.id, updateIoTobjectDto);
  }

  @Delete(':id')
  @Auth()
  async remove(@User() user: UserEntity, @Param('id') id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const IoTObject = await this.IoTObjectService.findOne(id);
    if (IoTObject.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.IoTObjectService.remove(id);
  }
}
