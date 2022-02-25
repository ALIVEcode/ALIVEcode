import {
	faCalculator,
	faCode,
	faFlask,
	faProjectDiagram,
} from '@fortawesome/free-solid-svg-icons';
import { Exclude, Type } from 'class-transformer';
import { CreatedByUser } from '../Generics/createdByUser.entity';
import { Professor } from '../User/user.entity';
import { CourseElement } from './course_element.entity';

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

/**
 * Course model in the database
 * @author Enric Soldevila
 */
export class Course extends CreatedByUser {
	/** Creator of the course (Professor) */
	@Exclude({ toPlainOnly: true })
	@Type(() => Professor)
	creator: Professor;

	/** Code to join the course (NOT USED YET) */
	code: string;

	/** Difficulty of the course */
	difficulty: COURSE_DIFFICULTY;

	/** Access to the course */
	access: COURSE_ACCESS;

	/** The subject of the course */
	subject: COURSE_SUBJECT;

	/** CourseElements inside the course */
	@Type(() => CourseElement)
	elements: CourseElement[];

	/** Display order of the CourseElements */
	@Type(() => Number)
	elementsOrder: number[];

	/**
	 * Gets the display in a short version, for example: (INFORMATIC => IN)
	 * @returns the subject display
	 */
	getSubjectDisplay() {
		return this.subject[0].toUpperCase() + this.subject.slice(1);
	}

	/**
	 * Gets an icon depending on the subject of the course
	 * @returns The icon
	 */
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
