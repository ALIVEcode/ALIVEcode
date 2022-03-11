import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ChallengeEntity, CHALLENGE_ACCESS, CHALLENGE_TYPE } from './entities/challenge.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChallengeAliveEntity } from './entities/challenges/challenge_alive.entity';
import { ChallengeCodeEntity } from './entities/challenges/challenge_code.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ChallengeProgressionData, ChallengeProgressionEntity } from './entities/challenge_progression.entity';
import { QueryDTO } from './dto/query.dto';
import { ChallengeAIEntity } from './entities/challenges/challenge_ai.entity';
import { ChallengeIoTEntity } from './entities/challenges/challenge_iot.entity';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectRepository(ChallengeEntity) private challengeRepo: Repository<ChallengeEntity>,
    @InjectRepository(ChallengeAliveEntity) private challengeAliveRepo: Repository<ChallengeAliveEntity>,
    @InjectRepository(ChallengeCodeEntity) private challengeCodeRepo: Repository<ChallengeCodeEntity>,
    @InjectRepository(ChallengeAIEntity) private challengeAIRepo: Repository<ChallengeAIEntity>,
    @InjectRepository(ChallengeIoTEntity) private challengeIoTRepo: Repository<ChallengeIoTEntity>,
    @InjectRepository(ChallengeProgressionEntity)
    private challengeProgressionRepo: Repository<ChallengeProgressionEntity>,
  ) {}

  async createChallengeAlive(creator: UserEntity, createChallengeDto: ChallengeAliveEntity) {
    const challenge = this.challengeAliveRepo.create({ ...createChallengeDto, creator });
    return await this.challengeAliveRepo.save(challenge);
  }

  async createChallengeCode(creator: UserEntity, createChallengeDto: ChallengeCodeEntity) {
    const challenge = this.challengeCodeRepo.create({ ...createChallengeDto, creator });
    return await this.challengeCodeRepo.save(challenge);
  }

  async createChallengeAI(creator: UserEntity, createChallengeDto: ChallengeAIEntity) {
    const challenge = this.challengeAIRepo.create({ ...createChallengeDto, creator });
    return await this.challengeAIRepo.save(challenge);
  }

  async createChallengeIoT(creator: UserEntity, createChallengeDto: ChallengeIoTEntity) {
    const challenge = this.challengeIoTRepo.create({ ...createChallengeDto, creator });
    return await this.challengeIoTRepo.save(challenge);
  }

  async findAll() {
    return await this.challengeRepo.find();
  }

  async findQuery(query: QueryDTO) {
    return await this.challengeRepo.find({
      where: { access: CHALLENGE_ACCESS.PUBLIC, name: ILike(`%${query?.txt ?? ''}%`) },
      order: {
        creationDate: 'DESC',
        name: 'ASC',
      },
    });
  }

  async findOne(id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const challenge = await this.challengeRepo.findOne(id);
    if (!challenge) throw new HttpException('Challenge not found', HttpStatus.NOT_FOUND);
    return challenge;
  }

  async update(id: string, updateChallengeDto: ChallengeEntity) {
    return await this.challengeRepo.save({
      id,
      ...updateChallengeDto,
    });
  }

  async remove(id: string) {
    return await this.challengeRepo.remove(await this.findOne(id));
  }

  async getIoTProgressionById(challengeId: string, id: string) {
    const progression = await this.challengeProgressionRepo
      .createQueryBuilder('challengeProgression')
      .where('challengeProgression.id = :id', { id })
      .innerJoinAndSelect('challengeProgression.challenge', 'challenge')
      .andWhere('challenge.id = :challengeId', { challengeId })
      .andWhere('challenge.type = :type', { type: CHALLENGE_TYPE.IOT })
      .getOne();
    if (!progression) throw new HttpException('Progression not found', HttpStatus.NOT_FOUND);
    return progression;
  }

  async getProgression(challengeId: string, user: UserEntity) {
    const progression = await this.challengeProgressionRepo.findOne({ where: { challengeId: challengeId, user } });
    if (!progression) throw new HttpException('Progression not found', HttpStatus.NOT_FOUND);
    return progression;
  }

  async updateProgression(challengeId: string, user: UserEntity, updateProgressionDto: ChallengeProgressionEntity) {
    const challenge = await this.challengeRepo.findOne(challengeId, { relations: ['project'] });
    if (!challenge) throw new HttpException('Invalid challenge', HttpStatus.BAD_REQUEST);

    let progression: ChallengeProgressionEntity;
    try {
      progression = await this.getProgression(challengeId, user);
    } catch {
      // First time saving progression
      progression = this.challengeProgressionRepo.create(updateProgressionDto);
      if (challenge.type === CHALLENGE_TYPE.IOT) {
        updateProgressionDto.data = {
          layout: (challenge as ChallengeIoTEntity).project.layout,
        };
      }
    }
    return await this.challengeProgressionRepo.save({
      ...updateProgressionDto,
      id: progression.id,
      challengeId,
      user,
    });
  }
}
