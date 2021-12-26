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
import { LevelService } from '../../models/level/level.service';
import { LevelEntity } from '../../models/level/entities/level.entity';
import { LevelAliveEntity } from '../../models/level/entities/levelAlive.entity';
import { LevelCodeEntity } from '../../models/level/entities/levelCode.entity';
import { LevelAIEntity } from '../../models/level/entities/levelAI.entity';
import { LevelIoTEntity } from '../../models/level/entities/levelIoT.entity';
import { LevelProgressionEntity } from '../../models/level/entities/levelProgression.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IoTObjectEntity,
      IoTProjectEntity,
      IoTRouteEntity,
      AsScriptEntity,
      LevelEntity,
      LevelAliveEntity,
      LevelCodeEntity,
      LevelAIEntity,
      LevelIoTEntity,
      LevelProgressionEntity,
    ]),
  ],
  providers: [IoTObjectService, IoTProjectService, IoTGateway, AsScriptService, LevelService],
})
export class IoTModule {}