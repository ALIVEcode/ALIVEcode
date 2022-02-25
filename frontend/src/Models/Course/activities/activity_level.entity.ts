import { Transform, plainToClass } from 'class-transformer';
import { Level } from '../../Level/level.entity';
import { Activity } from '../activity.entity';
import { LEVEL_TYPE } from '../../../../../backend/src/models/level/entities/level.entity';
import { LevelAlive } from '../../Level/levelAlive.entity';
import { LevelCode } from '../../Level/levelCode.entity';
import { LevelAI } from '../../Level/levelAI.entity';
import { LevelIoT } from '../../Level/levelIoT.entity';

/**
 * Activity of type Level model in the database
 * @author Enric Solevila
 */
export class ActivityLevel extends Activity {
	/** Reference to the level to display */
	@Transform(({ value: level }: { value: Level }) => {
		if (level.type === LEVEL_TYPE.ALIVE) return plainToClass(LevelAlive, level);
		if (level.type === LEVEL_TYPE.CODE) return plainToClass(LevelCode, level);
		if (level.type === LEVEL_TYPE.AI) return plainToClass(LevelAI, level);
		if (level.type === LEVEL_TYPE.IOT) return plainToClass(LevelIoT, level);
		return plainToClass(Level, level);
	})
	level?: Level[];
}
