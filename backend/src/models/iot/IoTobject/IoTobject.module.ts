import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoTObjectEntity } from './entities/IoTobject.entity';
import { IoTObjectController } from './IoTobject.controller';
import { IoTObjectService } from './IoTobject.service';
import { UserEntity } from '../../user/entities/user.entity';
import { IoTProjectService } from '../IoTproject/IoTproject.service';
import { IoTProjectModule } from '../IoTproject/IoTproject.module';
import { IoTProjectEntity } from '../IoTproject/entities/IoTproject.entity';
import { IoTRouteEntity } from '../IoTroute/entities/IoTroute.entity';
import { IoTProjectObjectEntity } from '../IoTproject/entities/IoTprojectObject.entity';
import { AsScriptEntity } from '../../as-script/entities/as-script.entity';
import { ChallengeProgressionEntity } from '../../challenge/entities/challenge_progression.entity';
import { ChallengeService } from '../../challenge/challenge.service';
import { AsScriptService } from '../../as-script/as-script.service';
import { ChallengeEntity } from '../../challenge/entities/challenge.entity';
import { ChallengeAliveEntity } from '../../challenge/entities/challenges/challenge_alive.entity';
import { ChallengeIoTEntity } from '../../challenge/entities/challenges/challenge_iot.entity';
import { ChallengeAIEntity } from '../../challenge/entities/challenges/challenge_ai.entity';
import { ChallengeCodeEntity } from '../../challenge/entities/challenges/challenge_code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IoTObjectEntity,
      IoTProjectEntity,
      IoTRouteEntity,
      IoTProjectObjectEntity,
      AsScriptEntity,
      ChallengeProgressionEntity,
      ChallengeEntity,
      ChallengeAliveEntity,
      ChallengeIoTEntity,
      ChallengeAIEntity,
      ChallengeCodeEntity,
      UserEntity,
    ]),
    IoTProjectModule,
  ],
  controllers: [IoTObjectController],
  providers: [IoTObjectService, IoTProjectService, ChallengeService, AsScriptService],
})
export class IoTObjectModule {}
