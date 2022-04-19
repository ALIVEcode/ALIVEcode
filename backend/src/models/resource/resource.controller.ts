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
  UploadedFile,
} from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceEntity, RESOURCE_TYPE } from './entities/resource.entity';
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
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../user/user.service';
import { unlink } from 'fs/promises';
import { FileService } from '../file/file.service';

/**
 * All the routes to create/update/delete/get a resource or upload files/videos/images
 * @author Enric Soldevila
 */
@Controller('resources')
@ApiTags('resources')
@UseInterceptors(DTOInterceptor)
export class ResourceController {
  constructor(
    private readonly resourceService: ResourceService,
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  /**
   * Finds a resource by its id. Needs to be the resource creator
   * @param resource Resource found by the id in the request
   * @returns The resource found
   */
  @Get(':id')
  @Auth()
  @UseGuards(ResourceCreator)
  async findOne(@Resource() resource: ResourceEntity) {
    return resource;
  }

  /**
   * Route to create a resource. Needs to be a professor
   *
   * This route works by accepting Content-Type: multipart-formdata when a resource
   * requires a file to be uploaded alongside it and Content-Type: application/json
   * when no file needs to be uploaded.
   * The multipart-formdata fields must be structured like so:
   *
   *   data: JSON.stringify(ResourceDTO)
   *   file: File object to upload
   *
   * @param user User creating the resource
   * @param dto DTO to create the resource with
   * @returns The newly created resource
   */
  @Post()
  @Auth(Role.PROFESSOR)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @User() user: ProfessorEntity,
    @Body() dto: CreateResourceDTOSimple,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      try {
        const createdFile = await this.fileService.create(file);
        // dto.resource.fileId = createdFile.id;
        dto.resource.file = createdFile;
        await this.userService.alterStorageUsed(user, file.size);
      } catch (err) {
        unlink(file.path);
        throw err;
      }
    }

    dto.resource.type = dto.type;
    const errors = await validate(plainToInstance(CreateResourceDTO, dto));
    if (errors.length > 0) throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    return await this.resourceService.create(dto, user);
  }

  /**
   * Route to update a resource by its id with a DTO. Needs to be the resource creator
   * @param resource Resource found by the id in the request
   * @param id Id of the resource
   * @param dto DTO to update the resource with
   * @returns The newly updated resource
   */
  @Patch(':id')
  @UseGuards(ResourceCreator)
  async update(@Resource() res: ResourceEntity, @Param('id') id: string, @Body() dto: CreateResourceDTOSimple) {
    dto.resource.type = res.type;
    const errors = await validate(plainToInstance(CreateResourceDTO, dto));
    if (errors.length > 0) throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    return await this.resourceService.update(id, dto);
  }

  /**
   * Route to delete a resource by its id. Needs to be the resource creator
   * @param id Id of the resource to delete
   * @returns The query deletion result
   */
  @Delete(':id')
  @UseGuards(ResourceCreator)
  async remove(@Param('id') id: string) {
    return await this.resourceService.remove(id);
  }
}
