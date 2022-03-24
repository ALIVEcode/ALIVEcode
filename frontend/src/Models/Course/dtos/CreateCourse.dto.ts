import { Type } from 'class-transformer';
import { Course } from '../course.entity';

/**
 * DTO to create a course (Data Transfer Object)
 * @author Enric Soldevila
 */
export class CreateCourseDTO {
	/** (OPTIONAL) id of the classroom to create the course in */
	classId?: string;

	/** Course object to create */
	@Type(() => Course)
	course: Course;
}
