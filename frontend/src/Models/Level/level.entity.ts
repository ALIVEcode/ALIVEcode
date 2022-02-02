import { Exclude, Transform, Type, plainToClass } from 'class-transformer';
import { CreatedByUser } from '../Generics/createdByUser.entity';
import { User, Professor, Student } from '../User/user.entity';
import { ActivityLevel } from '../Course/activity_level.entity';

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
	@Type(() => User)
	@Transform(
		({ value }) => {
			if (!value) return value;
			if (value.firstName) return plainToClass(Professor, value);
			if (value.name) return plainToClass(Student, value);
			return value;
		},
		{ toClassOnly: true },
	)
	creator: User | undefined;

	type: LEVEL_TYPE;

	access: LEVEL_ACCESS;

	difficulty: LEVEL_DIFFICULTY;

	hints: string[];

	tags: LEVEL_TAG[];

	@Type(() => ActivityLevel)
	activities?: ActivityLevel[];

	getTypeDisplay() {
		if (this.type === LEVEL_TYPE.ALIVE) return 'Car coding';
		if (this.type === LEVEL_TYPE.CODE) return 'Coding';
		if (this.type === LEVEL_TYPE.AI) return 'Aritificial Intelligence';
		if (this.type === LEVEL_TYPE.IOT) return 'Internet of Things';
		return;
	}
}