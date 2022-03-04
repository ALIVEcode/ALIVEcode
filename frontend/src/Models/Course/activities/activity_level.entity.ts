import { Transform, plainToClass } from 'class-transformer';
import { Activity } from '../activity.entity';
import { LEVEL_TYPE } from '../../../../../backend/src/models/level/entities/level.entity';
import { LevelAlive } from '../../Level/levelAlive.entity';
import { LevelCode } from '../../Level/levelCode.entity';
import { LevelAI } from '../../Level/levelAI.entity';
import { LevelIoT } from '../../Level/levelIoT.entity';
import { ResourceLevel } from '../../Resource/entities/resource_level.entity';

/**
 * Activity of type Level model in the database
 * @author Enric Solevila
 */
export class ActivityLevel extends Activity {
	/** Reference to the level to display */
	@Transform(({ value: res }: { value: ResourceLevel }) => {
		if (res.level.type === LEVEL_TYPE.ALIVE)
			res.level = plainToClass(LevelAlive, res);
		else if (res.level.type === LEVEL_TYPE.CODE)
			res.level = plainToClass(LevelCode, res);
		else if (res.level.type === LEVEL_TYPE.AI)
			res.level = plainToClass(LevelAI, res);
		else if (res.level.type === LEVEL_TYPE.IOT)
			res.level = plainToClass(LevelIoT, res);
		return res;
	})
	resourceLevel?: ResourceLevel[];
}
