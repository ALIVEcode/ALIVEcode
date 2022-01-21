import { Level } from '../../../Models/Level/level.entity';
import { LevelAlive } from '../../../Models/Level/levelAlive.entity';
import { LevelCode } from '../../../Models/Level/levelCode.entity';

export type LevelCardProps = {
	level: LevelAlive | LevelCode | Level;
	enterEdit?: boolean;
};
