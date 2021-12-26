import { Module } from '@nestjs/common';
import { AsScriptService } from './as-script.service';
import { AsScriptController } from './as-script.controller';
import { IoTProjectService } from '../iot/IoTproject/IoTproject.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';
import { IoTRouteEntity } from '../iot/IoTroute/entities/IoTroute.entity';
import { AsScriptEntity } from './entities/as-script.entity';
import { UserEntity } from '../user/entities/user.entity';
import { LevelModule } from '../level/level.module';
import { LevelService } from '../level/level.service';

@Module({
  imports: [TypeOrmModule.forFeature([IoTProjectEntity, IoTRouteEntity, AsScriptEntity, UserEntity]), LevelModule],
  controllers: [AsScriptController],
  providers: [AsScriptService, IoTProjectService, LevelService],
})
export class AsScriptModule {}
