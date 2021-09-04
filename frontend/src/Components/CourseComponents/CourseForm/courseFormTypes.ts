import {
	COURSE_ACCESS,
	COURSE_DIFFICULTY,
	COURSE_SUBJECT,
} from '../../../Types/Playground/courseType';

export type CourseFormValues = {
	name: string;
	description: string;
	access: COURSE_ACCESS;
	difficulty: COURSE_DIFFICULTY;
	subject: COURSE_SUBJECT;
};

export type CourseFormProps = {};
