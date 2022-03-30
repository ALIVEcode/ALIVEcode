import { SUBJECTS } from '../../../Types/sharedTypes';
import { COURSE_ACCESS, COURSE_DIFFICULTY } from '../course.entity';

/**
 * DTO to update a course (Data Transfer Object)
 * @author Enric Soldevila
 */
export class UpdateCourseDTO {
	/** Name of the course */
	name: string;

	/** Description of the course */
	description?: string;

	/** Difficulty of the course */
	difficulty: COURSE_DIFFICULTY;

	/** Access to the course */
	access: COURSE_ACCESS;

	/** The subject of the course */
	subject: SUBJECTS;
}
