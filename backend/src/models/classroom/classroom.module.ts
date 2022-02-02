import { Module } from '@nestjs/common';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomEntity } from './entities/classroom.entity';
import { CourseEntity } from '../course/entities/course.entity';
import { IoTProjectEntity } from '../iot/IoTproject/entities/IoTproject.entity';
import { IoTObjectEntity } from '../iot/IoTobject/entities/IoTobject.entity';
import { UserEntity } from '../user/entities/user.entity';
import { ProfessorEntity } from '../user/entities/professor.entity';
import { StudentEntity } from '../user/entities/student.entity';
import { UserService } from '../user/user.service';
import { LevelEntity } from '../level/entities/level.entity';
import { CourseHistoryEntity } from '../course/entities/course_history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClassroomEntity,
      UserEntity,
      ProfessorEntity,
      StudentEntity,
      CourseEntity,
      IoTProjectEntity,
      IoTObjectEntity,
      LevelEntity,
      CourseHistoryEntity,
    ]),
    //DefaultAdminModule,
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService, UserService],
})
export class ClassroomModule {
  /*constructor(private readonly adminSite: DefaultAdminSite) {
    // Register the User entity under the "User" section
    adminSite.register('Classroom', ClassroomEntity);
  }*/
}
