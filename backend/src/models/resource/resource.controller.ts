import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceEntity } from './entities/resource.entity';
import { Auth } from '../../utils/decorators/auth.decorator';
import { Role } from '../../utils/types/roles.types';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { ResourceCreator } from '../../utils/guards/resource.guard';
import { Resource } from '../../utils/decorators/resource.decorator';

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
  @Auth()
  @UseGuards(ResourceCreator)
  async findOne(@Resource() resource) {
    return resource;
  }

  @Patch(':id')
  @UseGuards(ResourceCreator)
  update(@Param('id') id: string, @Body() updateResourceDto: ResourceEntity) {
    return this.resourceService.update(id, updateResourceDto);
  }

  @Delete(':id')
  @UseGuards(ResourceCreator)
  remove(@Param('id') id: string) {
    return this.resourceService.remove(id);
  }
}
