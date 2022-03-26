import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ResourceEntity, RESOURCE_TYPE } from './entities/resource.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceChallengeEntity } from './entities/resource_challenge.entity';
import { ResourceFileEntity } from './entities/resource_file.entity';
import { ResourceImageEntity } from './entities/resource_image.entity';
import { ResourceTheoryEntity } from './entities/resource_theory.entity';
import { ResourceVideoEntity } from './entities/resource_video.entity';
import { CreateResourceDTO, CreateResourceDTOSimple } from './dto/CreateResource.dto';
import { ProfessorEntity } from '../user/entities/user.entity';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(ResourceEntity) private readonly resRepo: Repository<ResourceEntity>,
    @InjectRepository(ResourceChallengeEntity) private readonly resChallengeRepo: Repository<ResourceChallengeEntity>,
    @InjectRepository(ResourceFileEntity) private readonly resFileRepo: Repository<ResourceFileEntity>,
    @InjectRepository(ResourceImageEntity) private readonly resImageRepo: Repository<ResourceImageEntity>,
    @InjectRepository(ResourceTheoryEntity) private readonly resTheoryRepo: Repository<ResourceTheoryEntity>,
    @InjectRepository(ResourceVideoEntity) private readonly resVideoRepo: Repository<ResourceVideoEntity>,
  ) {}

  async genericSave(dto: CreateResourceDTOSimple, id?: string) {
    if (id) dto.resource.id = id;
    switch (dto.type) {
      case RESOURCE_TYPE.CHALLENGE:
        return await this.resChallengeRepo.save({ ...dto.resource, type: RESOURCE_TYPE.CHALLENGE });
      case RESOURCE_TYPE.FILE:
        return await this.resFileRepo.save({ ...dto.resource, type: RESOURCE_TYPE.FILE });
      case RESOURCE_TYPE.IMAGE:
        return await this.resImageRepo.save({ ...dto.resource, type: RESOURCE_TYPE.IMAGE, id: dto.uuid });
      case RESOURCE_TYPE.THEORY:
        return await this.resTheoryRepo.save({ ...dto.resource, type: RESOURCE_TYPE.THEORY });
      case RESOURCE_TYPE.VIDEO:
        return await this.resVideoRepo.save({ ...dto.resource, type: RESOURCE_TYPE.VIDEO });
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }

  async create(dto: CreateResourceDTO, professor: ProfessorEntity) {
    dto.resource.creator = professor;
    return await this.genericSave(dto);
  }

  async findOne(id: string) {
    const res = await this.resRepo.findOne(id);
    if (!res) throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
    return res;
  }

  async update(id: string, dto: CreateResourceDTOSimple) {
    return await this.genericSave(dto, id);
  }

  async remove(id: string) {
    return await this.resRepo.delete(id);
  }
}
