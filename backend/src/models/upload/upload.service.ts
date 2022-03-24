import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { UploadEntity } from './entities/upload.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class UploadsService {
  // constructor(@InjectRepository(UploadEntity) private uploadRepository: Repository<UploadEntity>) {}

  // creator: UserEntity,
  async create(file: Express.Multer.File) {
    console.log(file);
  }
}
