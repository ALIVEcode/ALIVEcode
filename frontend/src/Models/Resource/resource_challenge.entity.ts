import { Type } from 'class-transformer';
import { Challenge } from '../Challenge/challenge.entity';
import { Resource } from './resource.entity';

/**
 * Activity of type Challenge model in the database
 * @author Enric Solevila
 */
export class ResourceChallenge extends Resource {
	/** Reference to the challenge to display */
	@Type(() => Challenge)
	challenge: Challenge;

	/** Id of the challenge */
	challengeId: string;
}
