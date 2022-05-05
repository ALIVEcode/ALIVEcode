import { Type } from 'class-transformer';
import { Course } from '../course.entity';
/**
 * CourseTemplate model in the database
 * @author Enric Soldevila
 */
export class CourseTemplate {
	id: string;

	name: string;

	description: string;

	isPublic: boolean;

	@Type(() => Course)
	course: Course;
	courseId: string;
}
