import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  HttpException,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceEntity } from './entities/resource.entity';
import { Auth } from '../../utils/decorators/auth.decorator';
import { Role } from '../../utils/types/roles.types';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { ResourceCreator } from '../../utils/guards/resource.guard';
import { Resource } from '../../utils/decorators/resource.decorator';
import { CreateResourceDTO, CreateResourceDTOSimple } from './dto/CreateResource.dto';
import { ProfessorEntity } from '../user/entities/user.entity';
import { User } from '../../utils/decorators/user.decorator';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { HttpStatus } from '@nestjs/common';

@Controller('resources')
@UseInterceptors(DTOInterceptor)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @Auth(Role.PROFESSOR)
  async create(@User() user: ProfessorEntity, @Body() dto: CreateResourceDTOSimple) {
    dto.resource.type = dto.type;
    const errors = await validate(plainToInstance(CreateResourceDTO, dto));
    if (errors.length > 0) throw new HttpException(errors, HttpStatus.BAD_REQUEST);

    return await this.resourceService.create(dto, user);
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
