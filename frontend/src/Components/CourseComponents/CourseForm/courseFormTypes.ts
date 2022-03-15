import { Classroom } from '../../../Models/Classroom/classroom.entity';
import {
	COURSE_ACCESS,
	COURSE_DIFFICULTY,
} from '../../../Types/Playground/courseType';
import { SUBJECTS } from '../../../Types/sharedTypes';

export type CourseFormValues = {
	name: string;
	description: string;
	access: COURSE_ACCESS;
	difficulty: COURSE_DIFFICULTY;
	subject: SUBJECTS;
};

export interface CourseFormLocation {
	classroom?: Classroom;
}
