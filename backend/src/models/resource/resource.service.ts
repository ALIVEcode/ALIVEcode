import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ResourceEntity, RESOURCE_TYPE } from './entities/resource.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourceChallengeEntity } from './entities/resources/resource_challenge.entity';
import { CreateResourceDTO, CreateResourceDTOSimple } from './dto/CreateResource.dto';
import { ProfessorEntity, UserEntity } from '../user/entities/user.entity';
import { ResourceFileEntity } from './entities/resources/resource_file.entity';
import { ResourcePdfEntity } from './entities/resources/resource_pdf.entity';
import { ResourceImageEntity } from './entities/resources/resource_image.entity';
import { ResourceTheoryEntity } from './entities/resources/resource_theory.entity';
import { ResourceVideoEntity } from './entities/resources/resource_video.entity';
import { unlinkSync } from 'fs';
import { FileEntity } from '../file/entities/file.entity';

/**
 * Service that handles operations with the database
 * for the resources. (Creation, updating, deletion, etc.)
 * @author Enric Soldevila
 */
@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(ResourceEntity) private readonly resRepo: Repository<ResourceEntity>,
    @InjectRepository(ResourceChallengeEntity) private readonly resChallengeRepo: Repository<ResourceChallengeEntity>,
    @InjectRepository(ResourceFileEntity) private readonly resFileRepo: Repository<ResourceFileEntity>,
    @InjectRepository(ResourcePdfEntity) private readonly resPdfRepo: Repository<ResourcePdfEntity>,
    @InjectRepository(ResourceImageEntity) private readonly resImageRepo: Repository<ResourceImageEntity>,
    @InjectRepository(ResourceTheoryEntity) private readonly resTheoryRepo: Repository<ResourceTheoryEntity>,
    @InjectRepository(ResourceVideoEntity) private readonly resVideoRepo: Repository<ResourceVideoEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(FileEntity) private readonly fileRepo: Repository<FileEntity>,
  ) {}

  /**
   * Save any type of resource with generic and specific fields depending on its type
   * @param dto DTO to save the resource with
   * @param id Id of the resource to save
   * @returns The newly updated resource
   */
  async genericSave(dto: CreateResourceDTOSimple, id?: string) {
    if (id) dto.resource.id = id;
    switch (dto.type) {
      case RESOURCE_TYPE.CHALLENGE:
        return await this.resChallengeRepo.save({ ...dto.resource, type: RESOURCE_TYPE.CHALLENGE });
      case RESOURCE_TYPE.PDF:
        return await this.resPdfRepo.save({ ...dto.resource, type: RESOURCE_TYPE.PDF });
      case RESOURCE_TYPE.FILE:
        return await this.resFileRepo.save({ ...dto.resource, type: RESOURCE_TYPE.FILE });
      case RESOURCE_TYPE.IMAGE:
        return await this.resImageRepo.save({ ...dto.resource, type: RESOURCE_TYPE.IMAGE });
      case RESOURCE_TYPE.THEORY:
        return await this.resTheoryRepo.save({ ...dto.resource, type: RESOURCE_TYPE.THEORY });
      case RESOURCE_TYPE.VIDEO:
        return await this.resVideoRepo.save({ ...dto.resource, type: RESOURCE_TYPE.VIDEO });
      default:
        throw new HttpException(`Bad request, type not supported ${dto.type}`, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Create a type of resource based on a dto.
   * @param dto Dto to create a resource
   * @param professor Professor creating the resource
   * @returns The newly created resource
   */
  async create(dto: CreateResourceDTO, professor: ProfessorEntity) {
    dto.resource.creator = professor;
    return await this.genericSave(dto);
  }

  /**
   * Finds a resource in the database based on its id
   * @param id Id of the resource to find
   * @returns The found resource
   */
  async findOne(id: string) {
    const res = await this.resRepo.findOne(id);
    if (!res) throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);
    return res;
  }

  /**
   * Updates a resource based on its id with a DTO
   * @param id Id of the resource to update
   * @param dto DTO to update the resource with
   * @returns The updated resource
   */
  async update(id: string, dto: CreateResourceDTOSimple) {
    return await this.genericSave(dto, id);
  }

  /**
   * Deletes a resource and its associated file based on its id
   * @param id Id of the resource to remove
   * @returns The deletion query result
   */
  async remove(id: string) {
    const res = await this.resRepo.findOne(id);
    if (!res) throw new HttpException('Resource not found', HttpStatus.NOT_FOUND);

    const deletedRes = await this.resRepo.delete(id);

    const { file } = res;
    if (file) {
      unlinkSync(file.path);
      await this.fileRepo.delete(file.id);
      await this.userRepo.save({
        ...res.creator,
        storageUsed: res.creator.storageUsed - file.size,
      });
    }

    return deletedRes;
  }
}
