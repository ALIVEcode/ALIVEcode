import { HttpException, HttpStatus } from "@nestjs/common";
import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RESOURCE_TYPE } from 'src/models/resource/entities/resource.entity';
import { MyRequest } from '../guards/auth.guard';
import { nanoid } from 'nanoid';

export const createMulterOptions = (injected: any): MulterModuleOptions => {
  const req: MyRequest = injected.req;
  const { user } = req;
  const maxFileSize = Number(user?.storage) - Number(user?.storageUsed);

  return {
    limits: {
      fileSize: maxFileSize || 0,
    },
    fileFilter: async (
      req: MyRequest,
      file: Express.Multer.File,
      callback: (error: Error, acceptFile: boolean) => void,
    ) => {
      req.body = JSON.parse(req.body.data);
      const { type } = req.body;

      if (!type) callback(new HttpException('Missing type', HttpStatus.BAD_REQUEST), null);

      let acceptedMimetypes = [];

      if (type == RESOURCE_TYPE.VIDEO) acceptedMimetypes = ['video/mp4', 'video/mpeg', 'video/ogg', 'video/mp2t'];

      if (type !== RESOURCE_TYPE.FILE && !acceptedMimetypes.includes(file.mimetype)) {
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
    storage: diskStorage({
      destination: 'uploads/resources',
      filename: (req: MyRequest, file: Express.Multer.File, callback: (error: Error, filename: string) => void) => {
        const extension = extname(file.originalname);
        const filename = `${nanoid()}${extension}`;
        req.body.resource.url = filename;
        req.body.resource.extension = extension;
        callback(null, filename);
      },
    }),
  };
};
