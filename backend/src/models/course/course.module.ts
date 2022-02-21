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
import { LevelEntity } from '../level/entities/level.entity';
import { ActivityTheoryEntity } from './entities/activities/activity_theory.entity';
import { ActivityEntity } from './entities/activity.entity';
import { ActivityLevelEntity } from './entities/activities/activity_level.entity';
import { CourseElementEntity } from './entities/course_element.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      CourseElementEntity,
      SectionEntity,
      ActivityEntity,
      ActivityTheoryEntity,
      ActivityLevelEntity,
      UserEntity,
      ClassroomEntity,
      StudentEntity,
      CourseHistoryEntity,
      ProfessorEntity,
      IoTProjectEntity,
      IoTObjectEntity,
      LevelEntity,
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService, UserService],
})
export class CourseModule {}
