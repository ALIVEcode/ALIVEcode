import { Module } from '@nestjs/common';
import { IoTProjectService } from './IoTproject.service';
import { IoTProjectController } from './IoTproject.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoTProjectEntity } from './entities/IoTproject.entity';
import { UserEntity } from '../../user/entities/user.entity';
import { IoTRouteEntity } from '../IoTroute/entities/IoTroute.entity';
import { IoTObjectService } from '../IoTobject/IoTobject.service';
import { IoTObjectEntity } from '../IoTobject/entities/IoTobject.entity';
import { AsScriptEntity } from '../../as-script/entities/as-script.entity';
import { AsScriptService } from '../../as-script/as-script.service';
import { LevelService } from '../../level/level.service';
import { LevelEntity } from '../../level/entities/level.entity';
import { LevelAliveEntity } from '../../level/entities/levelAlive.entity';
import { LevelAIEntity } from '../../level/entities/levelAI.entity';
import { LevelCodeEntity } from '../../level/entities/levelCode.entity';
import { LevelIoTEntity } from '../../level/entities/levelIoT.entity';
import { LevelProgressionEntity } from '../../level/entities/levelProgression.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IoTProjectEntity,
      IoTRouteEntity,
      IoTObjectEntity,
      UserEntity,
      AsScriptEntity,
      LevelEntity,
      LevelAliveEntity,
      LevelAIEntity,
      LevelCodeEntity,
      LevelIoTEntity,
      LevelProgressionEntity,
    ]),
  ],
  controllers: [IoTProjectController],
  providers: [IoTProjectService, IoTObjectService, AsScriptService, LevelService],
})
export class IoTProjectModule {}
