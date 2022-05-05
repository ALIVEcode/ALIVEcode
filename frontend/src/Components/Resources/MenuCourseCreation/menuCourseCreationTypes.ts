import { Classroom } from '../../../Models/Classroom/classroom.entity';
import { Course, COURSE_ACCESS } from '../../../Models/Course/course.entity';
import { SUBJECTS } from '../../../Types/sharedTypes';

/**
 * Props of the MenuCourseCreation component
 */
export type MenuCourseCreationProps = {
	open: boolean;
	setOpen: (state: boolean) => void;
	updateMode?: boolean;
	defaultCourse?: Course;
	classroom?: Classroom;
};

/**
 * DTO model for creating or updating a course
 */
export type MenuCourseCreationDTO = {
	classId?: string;
	course: {
		name: string;
		description?: string;
		subject: SUBJECTS;
		access: COURSE_ACCESS;
	};
};
