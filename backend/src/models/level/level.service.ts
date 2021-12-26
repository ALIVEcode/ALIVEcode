import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LevelEntity, LEVEL_ACCESS, LEVEL_TYPE } from './entities/level.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { LevelAliveEntity } from './entities/levelAlive.entity';
import { LevelCodeEntity } from './entities/levelCode.entity';
import { UserEntity } from '../user/entities/user.entity';
import { LevelProgressionData, LevelProgressionEntity } from './entities/levelProgression.entity';
import { QueryDTO } from './dto/query.dto';
import { LevelAIEntity } from './entities/levelAI.entity';
import { LevelIoTEntity } from './entities/levelIoT.entity';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(LevelEntity) private levelRepository: Repository<LevelEntity>,
    @InjectRepository(LevelAliveEntity) private levelAliveRepo: Repository<LevelAliveEntity>,
    @InjectRepository(LevelCodeEntity) private levelCodeRepo: Repository<LevelCodeEntity>,
    @InjectRepository(LevelAIEntity) private levelAIRepo: Repository<LevelAIEntity>,
    @InjectRepository(LevelIoTEntity) private levelIoTRepo: Repository<LevelIoTEntity>,
    @InjectRepository(LevelProgressionEntity) private levelProgressionRepo: Repository<LevelProgressionEntity>,
  ) {}

  async createLevelAlive(creator: UserEntity, createLevelDto: LevelAliveEntity) {
    const level = this.levelAliveRepo.create({ ...createLevelDto, creator });
    return await this.levelAliveRepo.save(level);
  }

  async createLevelCode(creator: UserEntity, createLevelDto: LevelCodeEntity) {
    const level = this.levelCodeRepo.create({ ...createLevelDto, creator });
    return await this.levelCodeRepo.save(level);
  }

  async createLevelAI(creator: UserEntity, createLevelDto: LevelAIEntity) {
    const level = this.levelAIRepo.create({ ...createLevelDto, creator });
    return await this.levelAIRepo.save(level);
  }

  async createLevelIoT(creator: UserEntity, createLevelDto: LevelIoTEntity) {
    const level = this.levelIoTRepo.create({ ...createLevelDto, creator });
    return await this.levelIoTRepo.save(level);
  }

  async findAll() {
    return await this.levelRepository.find();
  }

  async findQuery(query: QueryDTO) {
    return await this.levelRepository.find({
      where: { access: LEVEL_ACCESS.PUBLIC, name: ILike(`%${query?.txt ?? ''}%`) },
      order: {
        creationDate: 'DESC',
        name: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const level = await this.levelRepository.findOne(id);
    if (!level) throw new HttpException('Level not found', HttpStatus.NOT_FOUND);
    return level;
  }

  async update(id: string, updateLevelDto: LevelEntity) {
    return await this.levelRepository.save({
      id,
      ...updateLevelDto,
    });
  }

  async remove(id: string) {
    return await this.levelRepository.remove(await this.findOne(id));
  }

  async getIoTProgressionById(levelId: string, id: string) {
    const progression = await this.levelProgressionRepo
      .createQueryBuilder('levelProgression')
      .where('levelProgression.id = :id', { id })
      .innerJoinAndSelect('levelProgression.level', 'level')
      .andWhere('level.id = :levelId', { levelId })
      .andWhere('level.type = :type', { type: LEVEL_TYPE.IOT })
      .getOne();
    if (!progression) throw new HttpException('Progression not found', HttpStatus.NOT_FOUND);
    return progression;
  }

  async getProgression(levelId: string, user: UserEntity) {
    const progression = await this.levelProgressionRepo.findOne({ where: { levelId, user } });
    if (!progression) throw new HttpException('Progression not found', HttpStatus.NOT_FOUND);
    return progression;
  }

  async updateProgression(levelId: string, user: UserEntity, updateProgressionDto: LevelProgressionEntity) {
    const level = await this.levelRepository.findOne(levelId, { relations: ['project'] });
    if (!level) throw new HttpException('Invalid level', HttpStatus.BAD_REQUEST);

    let progression: LevelProgressionEntity;
    let defaultData: LevelProgressionData;
    try {
      progression = await this.getProgression(levelId, user);
    } catch {
      // First time saving progression
      progression = this.levelProgressionRepo.create(updateProgressionDto);
      if (level.type === LEVEL_TYPE.IOT) {
        updateProgressionDto.data = {
          layout: (level as LevelIoTEntity).project.layout,
        };
      }
    }
    return await this.levelProgressionRepo.save({
      ...updateProgressionDto,
      id: progression.id,
      levelId,
      user,
    });
  }
}
