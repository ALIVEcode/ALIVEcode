import { Course, COURSE_ACCESS } from '../../../Models/Course/course.entity';
import { SUBJECTS } from '../../../Types/sharedTypes';

export type MenuCourseCreationProps = {
	open: boolean;
	setOpen: (state: boolean) => void;
	updateMode?: boolean;
	defaultCourse?: Course;
};

export type MenuCourseCreationDTO = {
	classId?: string;
	course: {
		name: string;
		description?: string;
		subject: SUBJECTS;
		access: COURSE_ACCESS;
	};
};
