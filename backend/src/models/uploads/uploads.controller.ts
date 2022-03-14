import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadsService } from './uploads.service';
// import { User } from './uploads.entity';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Uploads')
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
  @ApiOperation({summary: 'Route pour téléverser un fichier.'})
  @ApiResponse({status: 201, description: 'fichier téléversé avec succès'})
  @ApiResponse({status: 400, description: 'mauvaise requête'})
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.uploadsService.create(file);
  }

}
