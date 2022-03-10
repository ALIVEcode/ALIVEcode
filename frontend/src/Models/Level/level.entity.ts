import { Exclude, Type } from 'class-transformer';
import { USER_TYPES } from '../../Types/userTypes';
import { Activity } from '../Course/activity.entity';
import { CreatedByUser } from '../Generics/createdByUser.entity';
import { User, Professor, Student } from '../User/user.entity';

export enum LEVEL_TAG {}
export enum LEVEL_ACCESS {
	PUBLIC = 'PU', // can be found via a search
	UNLISTED = 'UN', // must be shared via a url
	RESTRICTED = 'RE', // limited to certain classes
	PRIVATE = 'PR', // only accessible to the creator
}

export enum LEVEL_DIFFICULTY {
	BEGINNER = 'BE',
	EASY = 'EA',
	MEDIUM = 'ME',
	ADVANCED = 'AD',
	HARD = 'HA',
	EXPERT = 'EX',
}

export enum LEVEL_TYPE {
	CODE = 'LevelCodeEntity',
	ALIVE = 'LevelAliveEntity',
	AI = 'LevelAIEntity',
	IOT = 'LevelIoTEntity',
}

export class Level extends CreatedByUser {
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

	type: LEVEL_TYPE;

	access: LEVEL_ACCESS;

	difficulty: LEVEL_DIFFICULTY;

	hints: string[];

	tags: LEVEL_TAG[];

	@Type(() => Activity)
	activities?: Activity[];

	getTypeDisplay() {
		if (this.type === LEVEL_TYPE.ALIVE) return 'Car coding';
		if (this.type === LEVEL_TYPE.CODE) return 'Coding';
		if (this.type === LEVEL_TYPE.AI) return 'Aritificial Intelligence';
		if (this.type === LEVEL_TYPE.IOT) return 'Internet of Things';
		return;
	}
}
