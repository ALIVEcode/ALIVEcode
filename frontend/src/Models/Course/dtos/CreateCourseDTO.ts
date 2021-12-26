import { Type } from 'class-transformer';
import { Course } from '../course.entity';

export class CreateCourseDTO {
	classId?: string;

	@Type(() => Course)
	course: Course;
}