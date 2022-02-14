import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceEntity } from './entities/resource.entity';
import { Auth } from '../utils/decorators/auth.decorator';
import { Role } from '../utils/types/roles.types';

@Controller('resource')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @Auth(Role.PROFESSOR)
  create(@Body() createResourceDto: ResourceEntity) {
    return this.resourceService.create(createResourceDto);
  }

  @Get(':id')
  @Auth(Role.STAFF)
  findOne(@Param('id') id: string) {
    return this.resourceService.findOne(id);
  }

  @Patch(':id')
  @Auth(Role.PROFESSOR)
  update(@Param('id') id: string, @Body() updateResourceDto: ResourceEntity) {
    return this.resourceService.update(id, updateResourceDto);
  }

  @Delete(':id')
  @Auth(Role.STAFF)
  remove(@Param('id') id: string) {
    return this.resourceService.remove(id);
  }
}
