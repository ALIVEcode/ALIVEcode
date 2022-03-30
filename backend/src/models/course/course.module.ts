import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { SectionEntity } from './entities/section.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { StudentEntity } from '../user/entities/user.entity';
import { CourseHistoryEntity } from './entities/course_history.entity';
import { UserService } from '../user/user.service';
import { ProfessorEntity } from '../user/entities/user.entity';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';
import { IoTObjectEntity } from '../iot/IoTobject/entities/IoTobject.entity';
import { ChallengeEntity } from '../challenge/entities/challenge.entity';
import { ActivityEntity } from './entities/activity.entity';
import { ActivityTheoryEntity } from './entities/activities/activity_theory.entity';
import { CourseElementEntity } from './entities/course_element.entity';
import { ActivityChallengeEntity } from './entities/activities/activity_challenge.entity';
import { ActivityVideoEntity } from './entities/activities/activity_video.entity';
import { ResourceEntity } from '../resource/entities/resource.entity';
import { ResourceService } from '../resource/resource.service';
import { ResourceChallengeEntity } from '../resource/entities/resource_challenge.entity';
import { ResourceVideoEntity } from '../resource/entities/resource_video.entity';
import { ResourceFileEntity } from '../resource/entities/resource_file.entity';
import { ResourceImageEntity } from '../resource/entities/resource_image.entity';
import { ResourceTheoryEntity } from '../resource/entities/resource_theory.entity';
import { ActivityAssignmentEntity } from './entities/activities/activity_assignment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      CourseElementEntity,
      SectionEntity,
      ActivityEntity,
      ActivityTheoryEntity,
      ActivityVideoEntity,
      ActivityAssignmentEntity,
      ActivityChallengeEntity,
      ResourceEntity,
      UserEntity,
      ClassroomEntity,
      StudentEntity,
      CourseHistoryEntity,
      ProfessorEntity,
      IoTProjectEntity,
      IoTObjectEntity,
      ChallengeEntity,
      ResourceChallengeEntity,
      ResourceVideoEntity,
      ResourceFileEntity,
      ResourceImageEntity,
      ResourceTheoryEntity,
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService, UserService, ResourceService],
})
export class CourseModule {}
