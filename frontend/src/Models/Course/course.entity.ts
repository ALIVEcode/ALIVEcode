import { Exclude, Type } from 'class-transformer';
import { CreatedByUser } from '../Generics/createdByUser.entity';
import { Professor } from '../User/user.entity';
import api from '../api';
import { Section } from './section.entity';
import {
	faCalculator,
	faCode,
	faFlask,
	faProjectDiagram,
} from '@fortawesome/free-solid-svg-icons';

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
		if (this.sections) return this.sections;
		this.sections = await api.db.courses.getSections({ id: this.id });
		return this.sections;
	}

	getSubjectDisplay() {
		return this.subject[0].toUpperCase() + this.subject.slice(1);
	}

	getSubjectIcon() {
		switch (this.subject) {
			case COURSE_SUBJECT.INFORMATIC:
				return faCode;
			case COURSE_SUBJECT.SCIENCE:
				return faFlask;
			case COURSE_SUBJECT.MATH:
				return faCalculator;
			case COURSE_SUBJECT.AI:
				return faProjectDiagram;
		}
		return faCode;
	}
}
