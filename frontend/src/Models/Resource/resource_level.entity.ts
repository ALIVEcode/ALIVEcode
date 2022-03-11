import { Type } from 'class-transformer';
import { Challenge } from '../Level/challenge.entity';
import { Resource } from './resource.entity';

/**
 * Activity of type Level model in the database
 * @author Enric Solevila
 */
export class ResourceChallenge extends Resource {
	/** Reference to the level to display */
	@Type(() => Challenge)
	challenge: Challenge;

	/** Id of the level */
	challengeId: string;
}
