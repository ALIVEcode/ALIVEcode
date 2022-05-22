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
import { ResourceChallengeEntity } from '../resource/entities/resources/resource_challenge.entity';
import { ActivityAssignmentEntity } from './entities/activities/activity_assignment.entity';
import { ResourceVideoEntity } from '../resource/entities/resources/resource_video.entity';
import { ResourceFileEntity } from '../resource/entities/resources/resource_file.entity';
import { ResourceTheoryEntity } from '../resource/entities/resources/resource_theory.entity';
import { BundleController } from './bundle.controller';
import { BundleEntity } from './entities/bundles/bundle.entity';
import { CourseTemplateEntity } from './entities/bundles/course_template.entity';
import { FileEntity } from '../file/entities/file.entity';
import { FileService } from '../file/file.service';
import { ActivityPdfEntity } from './entities/activities/activity_pdf.entity';
import { ResourcePdfEntity } from '../resource/entities/resources/resource_pdf.entity';
import { BundleService } from './bundle.service';

/**
 * Module for the course nestjs resource
 * @author Enric Soldevila
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      CourseElementEntity,
      SectionEntity,
      ActivityEntity,
      ActivityTheoryEntity,
      ActivityVideoEntity,
      ActivityPdfEntity,
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
      ResourcePdfEntity,
      ResourceFileEntity,
      ResourceTheoryEntity,
      BundleEntity,
      CourseTemplateEntity,
      FileEntity,
    ]),
  ],
  controllers: [CourseController, BundleController],
  providers: [CourseService, UserService, ResourceService, FileService, BundleService],
})
export class CourseModule {}
