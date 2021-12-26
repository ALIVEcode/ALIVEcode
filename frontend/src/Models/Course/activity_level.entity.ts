import { Transform, Type, plainToClass } from 'class-transformer';
import { Level, LEVEL_TYPE } from '../Level/level.entity';
import { LevelAI } from '../Level/levelAI.entity';
import { LevelAlive } from '../Level/levelAlive.entity';
import { LevelCode } from '../Level/levelCode.entity';
import { Activity } from './activity.entity';
import { LevelIoT } from '../Level/levelIoT.entity';

export class ActivityLevel {
	id: number;

	mustBeCompleted: boolean;

	@Type(() => Activity)
	activity?: Activity;

	@Transform(({ value: level }: { value: Level }) => {
		if (level.type === LEVEL_TYPE.ALIVE) return plainToClass(LevelAlive, level);
		if (level.type === LEVEL_TYPE.CODE) return plainToClass(LevelCode, level);
		if (level.type === LEVEL_TYPE.AI) return plainToClass(LevelAI, level);
		if (level.type === LEVEL_TYPE.IOT) return plainToClass(LevelIoT, level);
		return plainToClass(Level, level);
	})
	level: Level;
}