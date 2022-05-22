import { Module } from '@nestjs/common';
import { IoTRouteService } from './IoTroute.service';
import { IoTRouteController } from './IoTroute.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoTRouteEntity } from './entities/IoTroute.entity';
import { IoTProjectEntity } from '../IoTproject/entities/IoTproject.entity';
import { IoTProjectService } from '../IoTproject/IoTproject.service';
import { UserEntity } from '../../user/entities/user.entity';
import { AsScriptEntity } from '../../as-script/entities/as-script.entity';
import { AsScriptService } from '../../as-script/as-script.service';
import { ChallengeModule } from '../../challenge/challenge.module';
import { ChallengeService } from '../../challenge/challenge.service';
import { IoTObjectService } from '../IoTobject/IoTobject.service';
import { IoTProjectObjectEntity } from '../IoTproject/entities/IoTprojectObject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([IoTRouteEntity, IoTProjectEntity, UserEntity, AsScriptEntity, IoTProjectObjectEntity]),
    ChallengeModule,
  ],
  controllers: [IoTRouteController],
  providers: [IoTRouteService, IoTObjectService, IoTProjectService, AsScriptService, ChallengeService],
})
export class IoTRouteModule {}
