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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { MyRequest } from 'src/utils/guards/auth.guard';
import { extname } from 'path';
import { ResourceFileEntity } from './entities/resources/resource_file.entity';
import { ResourceImageEntity } from './entities/resources/resource_image.entity';

/**
 * All the routes to create/update/delete/get a resource or upload files/videos/images
 * @author Enric Soldevila
 */
@Controller('resources')
@ApiTags('resources')
@UseInterceptors(DTOInterceptor)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  /**
   * Route to create a resource. Needs to be a professor
   * @param user User creating the resource
   * @param dto DTO to create the resource with
   * @returns The newly created resource
   */
  @Post()
  @Auth(Role.PROFESSOR)
  async create(@User() user: ProfessorEntity, @Body() dto: CreateResourceDTOSimple) {
    dto.resource.type = dto.type;
    const errors = await validate(plainToInstance(CreateResourceDTO, dto));
    if (errors.length > 0) throw new HttpException(errors, HttpStatus.BAD_REQUEST);

    if (dto.type === RESOURCE_TYPE.IMAGE) {
      if (!dto.uuid) throw new HttpException('Bad payload', HttpStatus.BAD_REQUEST);
      (dto.resource as ResourceImageEntity).extension = extname((dto.resource as ResourceImageEntity).url);
    } else if (dto.type === RESOURCE_TYPE.FILE) {
      if (!dto.uuid) throw new HttpException('Bad payload', HttpStatus.BAD_REQUEST);
      (dto.resource as ResourceFileEntity).extension = extname((dto.resource as ResourceFileEntity).url);
    } else if (dto.type === RESOURCE_TYPE.VIDEO && dto.uuid) {
      (dto.resource as ResourceFileEntity).extension = extname((dto.resource as ResourceFileEntity).url);
    }

    return await this.resourceService.create(dto, user);
  }

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

  /**
   * Route to upload an image to the backend. Needs to be a professor
   * @param file Image file issued by the user for upload
   * @returns The result success or fail of the upload
   */
  @Post('/image')
  @ApiOperation({ summary: 'upload an image' })
  @Auth(Role.PROFESSOR)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1000000000000,
      },
      storage: diskStorage({
        destination: 'uploads/resources',
        filename: (req: MyRequest, file: Express.Multer.File, callback: (error: Error, filename: string) => void) => {
          if (!file) throw new HttpException('Missing file', HttpStatus.BAD_REQUEST);
          if (!req.body.uuid) throw new HttpException('Uuid missing', HttpStatus.BAD_REQUEST);
          callback(null, `${req.user.id}\$${req.body.uuid}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_, file: Express.Multer.File, callback: (error: Error, acceptFile: boolean) => void) => {
        const acceptedMimetypes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (!acceptedMimetypes.includes(file.mimetype)) {
          return callback(
            new HttpException(
              `Invalid filetype, accepted types: ${acceptedMimetypes.join(', ')}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return file;
  }

  /**
   * Route to upload a video to the backend. Needs to be a professor
   * @param file Video file issued by the user for upload
   * @returns The result success or fail of the upload
   */
  @Post('/video')
  @ApiOperation({ summary: 'upload a video' })
  @Auth(Role.PROFESSOR)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1000000000000,
      },
      storage: diskStorage({
        destination: 'uploads/resources',
        filename: (req: MyRequest, file: Express.Multer.File, callback: (error: Error, filename: string) => void) => {
          if (!file) throw new HttpException('Missing file', HttpStatus.BAD_REQUEST);
          if (!req.body.uuid) throw new HttpException('Uuid missing', HttpStatus.BAD_REQUEST);
          callback(null, `${req.user.id}\$${req.body.uuid}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_, file: Express.Multer.File, callback: (error: Error, acceptFile: boolean) => void) => {
        const acceptedMimetypes = ['video/mp4', 'video/mpeg', 'video/ogg', 'video/mp2t'];

        if (!acceptedMimetypes.includes(file.mimetype)) {
          return callback(
            new HttpException(
              `Invalid filetype, accepted types: ${acceptedMimetypes.join(', ')}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return file;
  }

  /**
   * Route to upload a file to the backend. Needs to be a professor
   * @param file File issued by the user for upload
   * @returns The result success or fail of the upload
   */
  @Post('/file')
  @ApiOperation({ summary: 'upload a file' })
  @Auth(Role.PROFESSOR)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1000000000000,
      },
      storage: diskStorage({
        destination: 'uploads/resources',
        filename: (req: MyRequest, file: Express.Multer.File, callback: (error: Error, filename: string) => void) => {
          if (!file) throw new HttpException('Missing file', HttpStatus.BAD_REQUEST);
          if (!req.body.uuid) throw new HttpException('Uuid missing', HttpStatus.BAD_REQUEST);
          callback(null, `${req.user.id}\$${req.body.uuid}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return file;
  }
}
