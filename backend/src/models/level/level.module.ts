import { Module } from '@nestjs/common';
import { LevelService } from './level.service';
import { LevelController } from './level.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelEntity } from './entities/level.entity';
import { UserEntity } from '../user/entities/user.entity';
import { LevelAliveEntity } from './entities/levelAlive.entity';
import { LevelCodeEntity } from './entities/levelCode.entity';
import { LevelProgressionEntity } from './entities/levelProgression.entity';
import { UserService } from '../user/user.service';
import { ProfessorEntity } from '../user/entities/professor.entity';
import { StudentEntity } from '../user/entities/student.entity';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { CourseEntity } from '../course/entities/course.entity';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';
import { IoTObjectEntity } from '../iot/IoTobject/entities/IoTobject.entity';
import { LevelAIEntity } from './entities/levelAI.entity';
import { LevelIoTEntity } from './entities/levelIoT.entity';

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
      ProfessorEntity,
      StudentEntity,
      ClassroomEntity,
      CourseEntity,
      IoTProjectEntity,
      IoTObjectEntity,
    ]),
  ],
  controllers: [LevelController],
  providers: [LevelService, UserService],
  exports: [TypeOrmModule],
})
export class LevelModule {}
