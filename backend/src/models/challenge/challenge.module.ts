import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChallengeEntity } from './entities/challenge.entity';
import { UserEntity, ProfessorEntity, StudentEntity } from '../user/entities/user.entity';
import { ChallengeAliveEntity } from './entities/challenges/challenge_alive.entity';
import { ChallengeCodeEntity } from './entities/challenges/challenge_code.entity';
import { ChallengeProgressionEntity } from './entities/challenge_progression.entity';
import { UserService } from '../user/user.service';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { CourseEntity } from '../course/entities/course.entity';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';
import { IoTObjectEntity } from '../iot/IoTobject/entities/IoTobject.entity';
import { ChallengeAIEntity } from './entities/challenges/challenge_ai.entity';
import { ChallengeIoTEntity } from './entities/challenges/challenge_iot.entity';
import { CourseHistoryEntity } from '../course/entities/course_history.entity';
import { ResourceEntity } from '../resource/entities/resource.entity';
import { IoTProjectService } from '../iot/IoTproject/IoTproject.service';
import { IoTRouteEntity } from '../iot/IoTroute/entities/IoTroute.entity';
import { AsScriptEntity } from '../as-script/entities/as-script.entity';
import { IoTProjectObjectEntity } from '../iot/IoTproject/entities/IoTprojectObject.entity';
import { AsScriptService } from '../as-script/as-script.service';
import { IoTObjectService } from '../iot/IoTobject/IoTobject.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChallengeEntity,
      UserEntity,
      ChallengeAliveEntity,
      ChallengeCodeEntity,
      ChallengeProgressionEntity,
      ChallengeAIEntity,
      ChallengeIoTEntity,
      ResourceEntity,
      ProfessorEntity,
      StudentEntity,
      ClassroomEntity,
      CourseEntity,
      IoTProjectEntity,
      IoTObjectEntity,
      IoTRouteEntity,
      AsScriptEntity,
      IoTProjectObjectEntity,
      CourseHistoryEntity,
    ]),
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService, UserService, IoTProjectService, AsScriptService, IoTObjectService],
  exports: [TypeOrmModule],
})
export class ChallengeModule {}
