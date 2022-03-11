import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceEntity } from './entities/resource.entity';
import { Auth } from '../../utils/decorators/auth.decorator';
import { Role } from '../../utils/types/roles.types';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { ResourceCreator } from '../../utils/guards/resource.guard';
import { Resource } from '../../utils/decorators/resource.decorator';
import { CreateResourceDTO } from './dto/CreateResource.dto';

@Controller('resources')
@UseInterceptors(DTOInterceptor)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @Auth(Role.PROFESSOR)
  async create(@Body() createResourceDto: CreateResourceDTO) {
    return await this.resourceService.create(createResourceDto);
  }

  @Get(':id')
  @Auth()
  @UseGuards(ResourceCreator)
  async findOne(@Resource() resource: ResourceEntity) {
    return resource;
  }

  @Patch(':id')
  @UseGuards(ResourceCreator)
  async update(@Param('id') id: string, @Body() updateResourceDto: ResourceEntity) {
    return await this.resourceService.update(id, updateResourceDto);
  }

  @Delete(':id')
  @UseGuards(ResourceCreator)
  async remove(@Param('id') id: string) {
    return await this.resourceService.remove(id);
  }
}
