import { User } from '../../Models/User/user.entity';
import { Section } from '../../Models/Course/section.entity';
import { SUBJECTS } from '../sharedTypes';

export enum COURSE_DIFFICULTY {
	BEGINNER = 1,
	EASY = 2,
	MEDIUM = 3,
	ADVANCED = 4,
	HARD = 5,
	EXPERT = 6,
}

export enum COURSE_ACCESS {
	PUBLIC = 'PU', // can be found via a search
	UNLISTED = 'UN', // must be shared via a url
	RESTRICTED = 'RE', // limited to certain classes
	PRIVATE = 'PR', // only accessible to the creator
}

export interface CourseInterface {
	id: string;
	name: string;
	description: string;
	subject: SUBJECTS;
	creator: User;
	difficulty: COURSE_DIFFICULTY;
	access: COURSE_ACCESS;
	code: string;
	sections: Array<Section>;
}
