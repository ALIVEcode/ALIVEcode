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
import { LevelModule } from '../../level/level.module';
import { LevelService } from '../../level/level.service';

@Module({
  imports: [TypeOrmModule.forFeature([IoTRouteEntity, IoTProjectEntity, UserEntity, AsScriptEntity]), LevelModule],
  controllers: [IoTRouteController],
  providers: [IoTRouteService, IoTProjectService, AsScriptService, LevelService],
})
export class IoTRouteModule {}
