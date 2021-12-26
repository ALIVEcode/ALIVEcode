import { Type } from 'class-transformer';
import { IsOptional, IsNotEmpty } from 'class-validator';
import { CourseEntity } from '../entities/course.entity';

export class CreateCourseDTO {
  @IsOptional()
  classId?: string;

  @IsNotEmpty()
  @Type(() => CourseEntity)
  course: CourseEntity;
}