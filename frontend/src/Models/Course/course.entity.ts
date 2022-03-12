import { faCloudsmith } from '@fortawesome/free-brands-svg-icons';
import {
	faBrain,
	faClipboardList,
	faCode,
} from '@fortawesome/free-solid-svg-icons';
import { Exclude, Type } from 'class-transformer';
import { getSubjectIcon, SUBJECTS } from '../../Types/sharedTypes';
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
	subject: SUBJECTS;

	/** CourseElements inside the course */
	@Exclude({ toPlainOnly: true })
	@Type(() => CourseElement)
	elements: CourseElement[];

	/** Display order of the CourseElements */
	@Type(() => Number)
	@Exclude({ toPlainOnly: true })
	elementsOrder: number[];

	/**
	 * Gets the display in a short version, for example: (INFORMATIC => IN)
	 * @returns the subject display
	 */
	@Exclude()
	getSubjectDisplay() {
		return this.subject[0].toUpperCase();
	}

	/**
	 * Gets an icon depending on the subject of the course
	 * @returns The icon
	 */
	@Exclude()
	getSubjectIcon() {
		return getSubjectIcon(this.subject);
	}
}
