import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessorEntity, StudentEntity, UserEntity } from './entities/user.entity';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { CourseEntity } from '../course/entities/course.entity';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';
import { IoTObjectEntity } from '../iot/IoTobject/entities/IoTobject.entity';
import { ChallengeEntity } from '../challenge/entities/challenge.entity';
import { ChallengeProgressionEntity } from '../challenge/entities/challenge_progression.entity';
import { CourseHistoryEntity } from '../course/entities/course_history.entity';
import { Quiz } from '../social/quizzes/entities/quiz.entity';
import { Result } from '../social/results/entities/result.entity';
import { ResourceEntity } from '../resource/entities/resource.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ProfessorEntity,
      StudentEntity,
      ClassroomEntity,
      CourseEntity,
      CourseHistoryEntity,
      ResourceEntity,
      IoTProjectEntity,
      IoTObjectEntity,
      ChallengeEntity,
      ChallengeProgressionEntity,
      Quiz,
      Result,
    ]),
  ],
  exports: [TypeOrmModule, UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
