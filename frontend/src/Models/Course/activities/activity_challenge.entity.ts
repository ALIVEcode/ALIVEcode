import { Activity } from '../activity.entity';
import { ResourceChallenge } from '../../Resource/resource_challenge.entity';
import { Type } from 'class-transformer';

/**
 * Activity of type Challenge model in the database
 * @author Enric Solevila
 */
export class ActivityChallenge extends Activity {
	/** Id of the resource of the activity */
	resourceId?: string;

	/** Resource of the activity */
	@Type(() => ResourceChallenge)
	resource: ResourceChallenge;
}
