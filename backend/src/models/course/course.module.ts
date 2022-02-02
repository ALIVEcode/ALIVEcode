import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from './entities/course.entity';
import { SectionEntity } from './entities/section.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ActivityEntity } from './entities/activity.entity';
import { ClassroomEntity } from '../classroom/entities/classroom.entity';
import { StudentEntity } from '../user/entities/student.entity';
import { CourseHistoryEntity } from './entities/course_history.entity';
import { UserService } from '../user/user.service';
import { ProfessorEntity } from '../user/entities/professor.entity';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';
import { IoTObjectEntity } from '../iot/IoTobject/entities/IoTobject.entity';
import { LevelEntity } from '../level/entities/level.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CourseEntity,
      SectionEntity,
      ActivityEntity,
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
