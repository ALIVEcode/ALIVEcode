import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeEntity, CHALLENGE_ACCESS } from './entities/challenge.entity';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';
import { UserEntity } from '../user/entities/user.entity';
import { hasRole } from '../user/auth';
import { ChallengeAliveEntity } from './entities/challenges/challenge_alive.entity';
import { ChallengeCodeEntity } from './entities/challenges/challenge_code.entity';
import { UserService } from '../user/user.service';
import { ChallengeProgressionEntity } from './entities/challenge_progression.entity';
import { QueryDTO } from './dto/query.dto';
import { ChallengeAIEntity } from './entities/challenges/challenge_ai.entity';
import { Auth } from '../../utils/decorators/auth.decorator';
import { User } from '../../utils/decorators/user.decorator';
import { Role } from '../../utils/types/roles.types';
import { ChallengeIoTEntity } from './entities/challenges/challenge_iot.entity';

@Controller('challenges')
@UseInterceptors(DTOInterceptor)
export class ChallengeController {
  constructor(private readonly challengeService: ChallengeService, private readonly userService: UserService) {}

  @Post('alive')
  @Auth()
  async createChallengeAlive(@User() user: UserEntity, @Body() createChallengeDto: ChallengeAliveEntity) {
    return await this.challengeService.createChallengeAlive(user, createChallengeDto);
  }

  @Post('code')
  @Auth()
  async createChallengeCode(@User() user: UserEntity, @Body() createChallengeDto: ChallengeCodeEntity) {
    return await this.challengeService.createChallengeCode(user, createChallengeDto);
  }

  @Post('ai')
  @Auth()
  async createChallengeAI(@User() user: UserEntity, @Body() createChallengeDto: ChallengeAIEntity) {
    return await this.challengeService.createChallengeAI(user, createChallengeDto);
  }

  @Post('iot')
  @Auth()
  async createChallengeIoT(@User() user: UserEntity, @Body() createChallengeDto: ChallengeIoTEntity) {
    return await this.challengeService.createChallengeIoT(user, createChallengeDto);
  }

  @Get()
  @Auth(Role.STAFF)
  async findAll() {
    return await this.challengeService.findAll();
  }

  @Post('query')
  @Auth()
  async findQuery(@Body() query: QueryDTO) {
    return await this.challengeService.findQuery(query);
  }

  @Get(':id')
  @Auth()
  async findOne(@User() user: UserEntity, @Param('id') id: string) {
    const challenge = await this.challengeService.findOne(id);
    if (challenge.creator.id === user.id || hasRole(user, Role.STAFF)) return challenge;
    if (challenge.access === CHALLENGE_ACCESS.PRIVATE || challenge.access === CHALLENGE_ACCESS.RESTRICTED)
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    return challenge;
  }

  @Get(':id/progressions/:userId')
  @Auth()
  async getProgression(@User() user: UserEntity, @Param('id') id: string, @Param('userId') userId: string) {
    if (user.id !== userId && !hasRole(user, Role.STAFF)) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    const target = await this.userService.findById(userId);
    return this.challengeService.getProgression(id, target);
  }

  @Patch(':id/progressions/:userId')
  @Auth()
  async updateProgression(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body() updateProgressionDto: ChallengeProgressionEntity,
  ) {
    if (user.id !== userId && !hasRole(user, Role.STAFF)) throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    const target = await this.userService.findById(userId);
    return this.challengeService.updateProgression(id, target, updateProgressionDto);
  }

  @Patch(':id')
  @Auth()
  async update(
    @User() user: UserEntity,
    @Param('id') id: string,
    @Body() updateChallengeDto: ChallengeEntity | ChallengeCodeEntity | ChallengeAliveEntity | ChallengeAIEntity,
  ) {
    const challenge = await this.challengeService.findOne(id);

    if (challenge.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.challengeService.update(id, updateChallengeDto);
  }

  @Delete(':id')
  @Auth()
  async remove(@User() user: UserEntity, @Param('id') id: string) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const challenge = await this.challengeService.findOne(id);

    if (challenge.creator.id !== user.id && !hasRole(user, Role.STAFF))
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    return await this.challengeService.remove(id);
  }
}
