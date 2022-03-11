import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ResourceEntity } from './entities/resource.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ResourceService {
  constructor(@InjectRepository(ResourceEntity) private readonly resRepo: Repository<ResourceEntity>) {}

  async create(createResourceDto: ResourceEntity) {
    return await this.resRepo.save(createResourceDto);
  }

  async findOne(id: string) {
    const res = await this.resRepo.findOne(id);
    if (!res) throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
    return res;
  }

  async update(id: string, updateResourceDto: ResourceEntity) {
    return await this.resRepo.save({ id, ...updateResourceDto });
  }

  async remove(id: string) {
    return await this.resRepo.delete(id);
  }
}
