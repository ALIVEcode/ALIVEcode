import { HttpException, HttpStatus } from "@nestjs/common";
import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { RESOURCE_TYPE } from 'src/models/resource/entities/resource.entity';
import { MyRequest } from '../guards/auth.guard';
import { nanoid } from 'nanoid';
import { ProfessorEntity } from 'src/models/user/entities/user.entity';

export const createMulterOptions = (req: any): MulterModuleOptions => {
  const user = req.req.user;
  console.log(user);
  const maxFileSize = Number(user?.storage) - Number(user?.storageUsed);
  console.log(maxFileSize);
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
      switch (type) {
        case RESOURCE_TYPE.IMAGE:
          acceptedMimetypes = ['image/jpeg', 'image/jpg', 'image/png'];
          break;
        case RESOURCE_TYPE.VIDEO:
          acceptedMimetypes = ['video/mp4', 'video/mpeg', 'video/ogg', 'video/mp2t'];
          break;
      }

      if (type !== RESOURCE_TYPE.FILE && !acceptedMimetypes.includes(file.mimetype)) {
        return callback(
          new HttpException(
            `Invalid filetype, accepted types: ${acceptedMimetypes.join(', ')}`,
            HttpStatus.BAD_REQUEST,
          ),
          false,
        );
      }

      try {
        // await userService.alterStorageUsed(req.user, file.size);
        callback(null, true);
      } catch (err) {
        callback(err, false);
      }
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
