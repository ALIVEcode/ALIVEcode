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

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseEntity, SectionEntity, ActivityEntity, UserEntity, ClassroomEntity, StudentEntity]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
