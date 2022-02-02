import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IoTObjectEntity } from './entities/IoTobject.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';

@Injectable()
export class IoTObjectService {
  constructor(@InjectRepository(IoTObjectEntity) private objectRepository: Repository<IoTObjectEntity>) {}

  async create(creator: UserEntity, createIoTObjectDto: IoTObjectEntity) {
    const iotObject = this.objectRepository.create(createIoTObjectDto);
    iotObject.creator = creator;
    return await this.objectRepository.save(iotObject);
  }

  async findAll() {
    return await this.objectRepository.find();
  }

  async findOne(id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const iotObject = await this.objectRepository.findOne(id);
    if (!iotObject) throw new HttpException('IoTObject not found', HttpStatus.NOT_FOUND);
    return iotObject;
  }

  async findOneWithLoadedProjects(id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const iotObject = await this.objectRepository
      .createQueryBuilder('iotObject')
      .where('iotObject.id = :id', { id })
      .leftJoinAndSelect('iotObject.iotProjects', 'iotProject')
      .getOne();
    if (!iotObject) throw new HttpException('IoTObject not found', HttpStatus.NOT_FOUND);
    return iotObject;
  }

  async update(id: string, updateIoTobjectDto: IoTObjectEntity) {
    return await this.objectRepository.save({ ...updateIoTobjectDto, id });
  }

  async remove(id: string) {
    return await this.objectRepository.delete(id);
  }
}
