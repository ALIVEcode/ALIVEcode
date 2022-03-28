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
import { ResourceImageEntity } from './entities/resource_image.entity';
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

@Controller('resources')
@ApiTags('resources')
@UseInterceptors(DTOInterceptor)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @Auth(Role.PROFESSOR)
  async create(@User() user: ProfessorEntity, @Body() dto: CreateResourceDTOSimple) {
    dto.resource.type = dto.type;
    const errors = await validate(plainToInstance(CreateResourceDTO, dto));
    if (errors.length > 0) throw new HttpException(errors, HttpStatus.BAD_REQUEST);

    console.log(dto);

    if (dto.type === RESOURCE_TYPE.IMAGE) {
      if (!dto.uuid) throw new HttpException('Bad payload', HttpStatus.BAD_REQUEST);
      (dto.resource as ResourceImageEntity).extension = extname((dto.resource as ResourceImageEntity).url);
    }

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
  async update(@Resource() res: ResourceEntity, @Param('id') id: string, @Body() dto: CreateResourceDTOSimple) {
    dto.resource.type = res.type;
    const errors = await validate(plainToInstance(CreateResourceDTO, dto));
    if (errors.length > 0) throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    return await this.resourceService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(ResourceCreator)
  async remove(@Param('id') id: string) {
    return await this.resourceService.remove(id);
  }

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
          callback(null, `${req.user.id}\$${req.body.uuid}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req: MyRequest, file: Express.Multer.File, callback: (error: Error, acceptFile: boolean) => void) => {
        const acceptedMimetypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
        ];

        if (!acceptedMimetypes.includes(file.mimetype)) {
          return callback(new HttpException(`Invalid filetype, accepted types: ${acceptedMimetypes.join(', ')}`, HttpStatus.BAD_REQUEST), false);
        }

        callback(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return file;
  }
}
