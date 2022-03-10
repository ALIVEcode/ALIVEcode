import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceEntity } from './entities/resource.entity';
import { Auth } from '../../utils/decorators/auth.decorator';
import { Role } from '../../utils/types/roles.types';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { User } from '../../utils/decorators/user.decorator';
import { ProfessorEntity } from '../user/entities/user.entity';
import { hasRole } from '../user/auth';

@Controller('resource')
@UseInterceptors(DTOInterceptor)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @Auth(Role.PROFESSOR)
  create(@Body() createResourceDto: ResourceEntity) {
    return this.resourceService.create(createResourceDto);
  }

  @Get(':id')
  @Auth(Role.PROFESSOR)
  async findOne(@User() professor: ProfessorEntity, @Param('id') id: string) {
    const res = await this.resourceService.findOne(id);
    if (res.creator.id === professor.id || hasRole(professor, Role.STAFF)) return res;
    throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
  }

  @Patch(':id')
  @Auth(Role.STAFF)
  update(@Param('id') id: string, @Body() updateResourceDto: ResourceEntity) {
    return this.resourceService.update(id, updateResourceDto);
  }

  @Delete(':id')
  @Auth(Role.STAFF)
  remove(@Param('id') id: string) {
    return this.resourceService.remove(id);
  }
}
