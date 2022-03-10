import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelEntity } from './entities/level.entity';
import { UserEntity, ProfessorEntity, StudentEntity } from '../user/entities/user.entity';
import { LevelAliveEntity } from './entities/levelAlive.entity';
import { LevelCodeEntity } from './entities/levelCode.entity';
import { LevelProgressionEntity } from './entities/levelProgression.entity';
import { UserService } from '../user/user.service';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { CourseEntity } from '../course/entities/course.entity';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';
import { IoTObjectEntity } from '../iot/IoTobject/entities/IoTobject.entity';
import { LevelAIEntity } from './entities/levelAI.entity';
import { LevelIoTEntity } from './entities/levelIoT.entity';
import { CourseHistoryEntity } from '../course/entities/course_history.entity';
import { ResourceEntity } from '../resource/entities/resource.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LevelEntity,
      UserEntity,
      LevelAliveEntity,
      LevelCodeEntity,
      LevelProgressionEntity,
      LevelAIEntity,
      LevelIoTEntity,
      ResourceEntity,
      ProfessorEntity,
      StudentEntity,
      ClassroomEntity,
      CourseEntity,
      IoTProjectEntity,
      IoTObjectEntity,
      CourseHistoryEntity,
    ]),
  ],
  controllers: [LevelController],
  providers: [LevelService, UserService],
  exports: [TypeOrmModule],
})
export class LevelModule {}
