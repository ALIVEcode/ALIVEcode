import { Module } from '@nestjs/common';
import { AsScriptService } from './as-script.service';
import { AsScriptController } from './as-script.controller';
import { IoTProjectService } from '../iot/IoTproject/IoTproject.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';
import { IoTRouteEntity } from '../iot/IoTroute/entities/IoTroute.entity';
import { AsScriptEntity } from './entities/as-script.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ChallengeModule } from '../challenge/challenge.module';
import { ChallengeService } from '../challenge/challenge.service';
import { IoTObjectService } from '../iot/IoTobject/IoTobject.service';
import { IoTProjectObjectEntity } from '../iot/IoTproject/entities/IoTprojectObject.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([IoTProjectEntity, IoTRouteEntity, AsScriptEntity, UserEntity, IoTProjectObjectEntity]),
    ChallengeModule,
  ],
  controllers: [AsScriptController],
  providers: [AsScriptService, IoTObjectService, IoTProjectService, ChallengeService],
})
export class AsScriptModule {}
