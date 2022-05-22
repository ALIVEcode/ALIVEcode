import { Type } from 'class-transformer';
import { IsOptional, IsNotEmpty, ValidateNested } from 'class-validator';
import { CourseEntity } from '../entities/course.entity';

/**
 * DTO to create a course (Data Transfer Object)
 * @author Enric Soldevila
 */
export class CreateCourseDTO {
  /** (OPTIONAL) id of the classroom to create the course in */
  @IsOptional()
  classId?: string;

  /** Course object to create */
  @IsNotEmpty()
  @Type(() => CourseEntity)
  @ValidateNested()
  course: CourseEntity;
}