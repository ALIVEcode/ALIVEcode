import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { UploadEntity } from './entities/upload.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class UploadsService {
//   constructor(@InjectRepository(UploadEntity) private uploadRepository: Repository<UploadEntity>) {}

  // creator: UserEntity,
  async create(file: Express.Multer.File) {
    console.log(file);
  }

//   async findAll() {
//     return await this.objectRepository.find();
//   }

//   async findOne(id: string) {
//     if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
//     const iotObject = await this.objectRepository.findOne(id);
//     if (!iotObject) throw new HttpException('IoTObject not found', HttpStatus.NOT_FOUND);
//     return iotObject;
//   }

//   async findOneWithLoadedProjects(id: string) {
//     if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
//     const iotObject = await this.objectRepository
//       .createQueryBuilder('iotObject')
//       .where('iotObject.id = :id', { id })
//       .leftJoinAndSelect('iotObject.iotProjects', 'iotProject')
//       .getOne();
//     if (!iotObject) throw new HttpException('IoTObject not found', HttpStatus.NOT_FOUND);
//     return iotObject;
//   }

//   async update(id: string, updateIoTobjectDto: IoTObjectEntity) {
//     return await this.objectRepository.save({ ...updateIoTobjectDto, id });
//   }

//   async remove(id: string) {
//     return await this.objectRepository.delete(id);
//   }
}

