import { Module } from '@nestjs/common';
import { IoTGateway } from './iot.gateway';
import { IoTObjectService } from '../../models/iot/IoTobject/IoTobject.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoTObjectEntity } from '../../models/iot/IoTobject/entities/IoTobject.entity';
import { IoTProjectEntity } from '../../models/iot/IoTproject/entities/IoTproject.entity';
import { IoTRouteEntity } from '../../models/iot/IoTroute/entities/IoTroute.entity';
import { IoTProjectService } from '../../models/iot/IoTproject/IoTproject.service';
import { AsScriptEntity } from '../../models/as-script/entities/as-script.entity';
import { AsScriptService } from '../../models/as-script/as-script.service';
import { ChallengeService } from '../../models/challenge/challenge.service';
import { ChallengeEntity } from '../../models/challenge/entities/challenge.entity';
import { ChallengeAliveEntity } from '../../models/challenge/entities/challenges/challenge_alive.entity';
import { ChallengeCodeEntity } from '../../models/challenge/entities/challenges/challenge_code.entity';
import { ChallengeAIEntity } from '../../models/challenge/entities/challenges/challenge_ai.entity';
import { ChallengeIoTEntity } from '../../models/challenge/entities/challenges/challenge_iot.entity';
import { ChallengeProgressionEntity } from '../../models/challenge/entities/challenge_progression.entity';
import { IoTProjectObjectEntity } from '../../models/iot/IoTproject/entities/IoTprojectObject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IoTObjectEntity,
      IoTProjectEntity,
      IoTProjectObjectEntity,
      IoTRouteEntity,
      AsScriptEntity,
      ChallengeEntity,
      ChallengeAliveEntity,
      ChallengeCodeEntity,
      ChallengeAIEntity,
      ChallengeIoTEntity,
      ChallengeProgressionEntity,
    ]),
  ],
  controllers: [IoTGateway],
  providers: [IoTObjectService, IoTProjectService, IoTGateway, AsScriptService, ChallengeService],
})
export class IoTSocketModule {}