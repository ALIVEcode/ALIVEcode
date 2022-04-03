import { Module } from '@nestjs/common';
import { IoTProjectService } from './IoTproject.service';
import { IoTProjectController } from './IoTproject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoTProjectEntity } from './entities/IoTproject.entity';
import { IoTRouteEntity } from '../IoTroute/entities/IoTroute.entity';
import { IoTObjectService } from '../IoTobject/IoTobject.service';
import { IoTObjectEntity } from '../IoTobject/entities/IoTobject.entity';
import { AsScriptEntity } from '../../as-script/entities/as-script.entity';
import { AsScriptService } from '../../as-script/as-script.service';
import { ChallengeService } from '../../challenge/challenge.service';
import { ChallengeEntity } from '../../challenge/entities/challenge.entity';
import { ChallengeAliveEntity } from '../../challenge/entities/challenges/challenge_alive.entity';
import { ChallengeAIEntity } from '../../challenge/entities/challenges/challenge_ai.entity';
import { ChallengeCodeEntity } from '../../challenge/entities/challenges/challenge_code.entity';
import { ChallengeIoTEntity } from '../../challenge/entities/challenges/challenge_iot.entity';
import { ChallengeProgressionEntity } from '../../challenge/entities/challenge_progression.entity';
import { IoTProjectObjectEntity } from './entities/IoTprojectObject.entity';
import { UserService } from '../../user/user.service';
import { UserModule } from '../../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IoTProjectEntity,
      IoTRouteEntity,
      IoTObjectEntity,
      IoTProjectObjectEntity,
      AsScriptEntity,
      ChallengeEntity,
      ChallengeAliveEntity,
      ChallengeAIEntity,
      ChallengeCodeEntity,
      ChallengeIoTEntity,
      ChallengeProgressionEntity,
    ]),
    UserModule,
  ],
  controllers: [IoTProjectController],
  providers: [IoTProjectService, IoTObjectService, AsScriptService, ChallengeService, UserService],
})
export class IoTProjectModule {}
