import { Exclude, Type } from 'class-transformer';
import { SUBJECTS } from '../../Types/sharedTypes';
import { USER_TYPES } from '../../Types/userTypes';
import { Activity } from '../Course/activity.entity';
import { CreatedByUser } from '../Generics/createdByUser.entity';
import { User, Professor, Student } from '../User/user.entity';

export enum CHALLENGE_TAG {}

export enum CHALLENGE_ACCESS {
	PUBLIC = 'PU', // can be found via a search
	UNLISTED = 'UN', // must be shared via a url
	RESTRICTED = 'RE', // limited to certain classes
	PRIVATE = 'PR', // only accessible to the creator
}

export enum CHALLENGE_DIFFICULTY {
	BEGINNER = 'BE',
	EASY = 'EA',
	MEDIUM = 'ME',
	ADVANCED = 'AD',
	HARD = 'HA',
	EXPERT = 'EX',
}

export enum CHALLENGE_TYPE {
	CODE = 'CO',
	ALIVE = 'AL',
	AI = 'AI',
	IOT = 'IOT',
}

export enum SUPPORTED_LANG {
	EN = 'EN',
	FR = 'FR',
}

export class Challenge extends CreatedByUser {
	@Exclude({ toPlainOnly: true })
	@Type(() => User, {
		discriminator: {
			property: 'type',
			subTypes: [
				{ value: Professor, name: USER_TYPES.PROFESSOR },
				{ value: Student, name: USER_TYPES.STUDENT },
			],
		},
	})
	creator: Professor | Student;

	type: CHALLENGE_TYPE;

	access: CHALLENGE_ACCESS;

	difficulty: CHALLENGE_DIFFICULTY;

	hints: string[];

	tags: CHALLENGE_TAG[];

	lang: SUPPORTED_LANG;

	getTypeDisplay() {
		if (this.type === CHALLENGE_TYPE.ALIVE) return 'Car coding';
		if (this.type === CHALLENGE_TYPE.CODE) return 'Coding';
		if (this.type === CHALLENGE_TYPE.AI) return 'Aritificial Intelligence';
		if (this.type === CHALLENGE_TYPE.IOT) return 'Internet of Things';
		return;
	}

	/**
	 * Returns the subject of the challenge based on its type
	 * @returns The subject of the challenge
	 */
	getSubject() {
		switch (this.type) {
			case CHALLENGE_TYPE.AI:
				return SUBJECTS.AI;
			case CHALLENGE_TYPE.IOT:
				return SUBJECTS.IOT;
			case CHALLENGE_TYPE.ALIVE:
			case CHALLENGE_TYPE.CODE:
				return SUBJECTS.CODE;
		}
		return SUBJECTS.OTHER;
	}
}
