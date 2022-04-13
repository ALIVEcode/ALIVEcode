import { Module } from '@nestjs/common';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ResourceEntity } from './entities/resource.entity';
import { UserEntity, ProfessorEntity, StudentEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { CourseEntity } from '../course/entities/course.entity';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';
import { IoTObjectEntity } from '../iot/IoTobject/entities/IoTobject.entity';
import { ChallengeEntity } from '../challenge/entities/challenge.entity';
import { CourseHistoryEntity } from '../course/entities/course_history.entity';
import { ResourceChallengeEntity } from './entities/resources/resource_challenge.entity';
import { ResourceFileEntity } from './entities/resources/resource_file.entity';
import { ResourceImageEntity } from './entities/resources/resource_image.entity';
import { ResourceTheoryEntity } from './entities/resources/resource_theory.entity';
import { ResourceVideoEntity } from './entities/resources/resource_video.entity';
import { MulterModule } from '@nestjs/platform-express';
import { createMulterOptions } from 'src/utils/upload/multer-config.service';
import { CurrentUserModule } from 'src/utils/upload/current-user.module';

/**
 * Module for the resource nestjs resource
 * @author Enric Soldevila
 */
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
    MulterModule.registerAsync({
      imports: [UserModule, CurrentUserModule],
      useFactory: createMulterOptions,
      inject: [UserService, 'CURRENT_USER'],
    }),
  ],
  controllers: [ResourceController],
  providers: [ResourceService, UserService],
})
export class ResourceModule {}
