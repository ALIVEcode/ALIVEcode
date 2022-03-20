import { Type } from 'class-transformer';
import { Activity } from '../activity.entity';
import { ResourceTheory } from '../../Resource/resource_theory.entity';

/**
 * Activity of type theory model in the database
 * @author Enric Solevila
 */
export class ActivityTheory extends Activity {
	/** Id of the resource of the activity */
	resourceId?: string;

	/** Resource of the activity */
	@Type(() => ResourceTheory)
	resource: ResourceTheory;
}
