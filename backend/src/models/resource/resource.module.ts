import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourceEntity } from './entities/resource.entity';
import { UserEntity, ProfessorEntity, StudentEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { CourseEntity } from '../course/entities/course.entity';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';
import { IoTObjectEntity } from '../iot/IoTobject/entities/IoTobject.entity';
import { ChallengeEntity } from '../challenge/entities/challenge.entity';
import { CourseHistoryEntity } from '../course/entities/course_history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      CourseHistoryEntity,
      ResourceEntity,
      UserEntity,
      ClassroomEntity,
      StudentEntity,
      ProfessorEntity,
      IoTProjectEntity,
      IoTObjectEntity,
      ChallengeEntity,
    ]),
  ],
  controllers: [ResourceController],
  providers: [ResourceService, UserService],
})
export class ResourceModule {}
