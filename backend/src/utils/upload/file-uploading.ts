import { HttpException, HttpStatus } from '@nestjs/common';
import { MyRequest } from '../guards/auth.guard';
import { extname } from "path";

export const editFileName = (
  req: MyRequest,
  file: Express.Multer.File,
  callback: (error: Error, filename: string) => void,
) => {
  if (!file) throw new HttpException('Missing file', HttpStatus.BAD_REQUEST);
  // req.user.id
  callback(null, `test${extname(file.originalname)}`);
};

export const imageFileFilter = (
  req: MyRequest,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  const acceptedMimetypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
  ]
  if (!acceptedMimetypes.includes(file.mimetype)) {
    return callback(
      new HttpException(`Invalid filetype, file must be either ${acceptedMimetypes.join(', ')}`, HttpStatus.BAD_REQUEST),
      false
    );
  }
  callback(null, true);
};
