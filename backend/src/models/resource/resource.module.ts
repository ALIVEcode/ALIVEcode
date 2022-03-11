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
import { ResourceChallengeEntity } from './entities/resource_challenge.entity';
import { ResourceFileEntity } from './entities/resource_file.entity';
import { ResourceImageEntity } from './entities/resource_image.entity';
import { ResourceTheoryEntity } from './entities/resource_theory.entity';
import { ResourceVideoEntity } from './entities/resource_video.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      CourseHistoryEntity,
      ResourceEntity,
      ResourceChallengeEntity,
      ResourceFileEntity,
      ResourceImageEntity,
      ResourceTheoryEntity,
      ResourceVideoEntity,
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
