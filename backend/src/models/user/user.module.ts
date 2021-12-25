import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ProfessorEntity } from './entities/professor.entity';
import { StudentEntity } from './entities/student.entity';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { CourseEntity } from '../course/entities/course.entity';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';
import { IoTObjectEntity } from '../iot/IoTobject/entities/IoTobject.entity';
import { LevelEntity } from '../level/entities/level.entity';
import { LevelProgressionEntity } from '../level/entities/levelProgression.entity';
import { Quiz } from '../social/quizzes/entities/quiz.entity';
import { Result } from '../social/results/entities/result.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProfessorEntity,
      StudentEntity,
      ClassroomEntity,
      CourseEntity,
      IoTProjectEntity,
      IoTObjectEntity,
      LevelEntity,
      LevelProgressionEntity,
      Quiz,
      Result
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
