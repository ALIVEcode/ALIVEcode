import { Module } from '@nestjs/common';
import { UserService } from '../../models/user/user.service';
import { UserSocketGateway } from './userSocket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from '../../models/social/quizzes/entities/quiz.entity';
import { Result } from '../../models/social/results/entities/result.entity';
import { ChallengeProgressionEntity } from '../../models/challenge/entities/challenge_progression.entity';
import { ChallengeEntity } from '../../models/challenge/entities/challenge.entity';
import { IoTObjectEntity } from '../../models/iot/IoTobject/entities/IoTobject.entity';
import { IoTProjectEntity } from '../../models/iot/IoTproject/entities/IoTproject.entity';
import { ResourceEntity } from '../../models/resource/entities/resource.entity';
import { CourseHistoryEntity } from '../../models/course/entities/course_history.entity';
import { CourseEntity } from '../../models/course/entities/course.entity';
import { ClassroomEntity } from '../../models/classroom/entities/classroom.entity';
import { StudentEntity, ProfessorEntity, UserEntity } from '../../models/user/entities/user.entity';

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
  controllers: [UserSocketGateway],
  providers: [UserSocketGateway, UserService],
})
export class UserSocketModule {}