import { Type } from 'class-transformer';
import { Level } from '../../Level/level.entity';
import { Resource } from './resource.entity';

/**
 * Activity of type Level model in the database
 * @author Enric Solevila
 */
export class ResourceLevel extends Resource {
	/** Reference to the level to display */
	@Type(() => Level)
	level: Level;

	/** Id of the level */
	levelId: string;
}
