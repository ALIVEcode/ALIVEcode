import { Exclude, Transform, Type, plainToClass } from 'class-transformer';
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

export class Level extends CreatedByUser {
	@Exclude({ toPlainOnly: true })
	@Type(() => User)
	@Transform(
		({ value }) => {
			if (value.firstName) return plainToClass(Professor, value);
			if (value.name) return plainToClass(Student, value);
			return value;
		},
		{ toClassOnly: true },
	)
	creator: User;

	access: LEVEL_ACCESS;

	difficulty: LEVEL_DIFFICULTY;

	hints: string[];

	tags: LEVEL_TAG[];

	getTypeDisplay() {
		if (this instanceof LevelAlive) return 'Car coding';
		if (this instanceof LevelCode) return 'Coding';
		return;
	}
}

const LevelAlive = require('./levelAlive.entity').LevelAlive;
const LevelCode = require('./levelCode.entity').LevelCode;