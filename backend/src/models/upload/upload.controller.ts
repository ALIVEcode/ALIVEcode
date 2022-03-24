import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
// import { User } from './uploads.entity';
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiConsumes } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './upload.service';
import { Role } from '../../utils/types/roles.types';
import { Auth } from '../../utils/decorators/auth.decorator';
import { diskStorage } from 'multer';
import { imageFileFilter, editFileName } from 'src/utils/upload/file-uploading';

// const editFilename = () => {

// }

// const filterFileType = () => {

// }

@ApiTags('upload')
@Controller('upload')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiConsumes('multipart/formdata')
  @ApiOperation({summary: ''})
  @ApiResponse({status: 201, description: 'File uploaded'})
  @ApiResponse({status: 400, description: 'Bad request'})
  @ApiResponse({status: 401, description: 'Unauthorized'})
  // @Auth(Role.PROFESSOR)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.create(file);
  }
}
