import { Exclude, Type } from 'class-transformer';
import { CreatedByUser } from '../Generics/createdByUser.entity';
import { Professor } from '../User/user.entity';
import api from '../api';
import { Section } from './section.entity';

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

export enum COURSE_SUBJECT {
	INFORMATIC = 'IN',
	AI = 'AI',
	MATH = 'MA',
	SCIENCE = 'SC',
}

export class Course extends CreatedByUser {
	@Exclude({ toPlainOnly: true })
	@Type(() => Professor)
	creator: Professor;

	// The code consists of letters from a-z and numbers from 0-9 | case non-senstive
	code: string;

	difficulty: COURSE_DIFFICULTY;

	access: COURSE_ACCESS;

	subject: COURSE_SUBJECT;

	@Type(() => Section)
	sections: Section[];

	async getSections() {
		this.sections = await api.db.courses.getSections({ id: this.id });
		return api.db.courses.getSections({ id: this.id });
	}

	getSubjectDisplay() {
		return this.subject[0].toUpperCase() + this.subject.slice(1);
	}
}
