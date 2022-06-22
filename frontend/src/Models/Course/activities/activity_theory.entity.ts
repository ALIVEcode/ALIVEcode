import { Type } from 'class-transformer';
import { Activity } from '../activity.entity';
import { ResourceTheory } from '../../Resource/resources/resource_theory.entity';
import { RESOURCE_TYPE } from '../../Resource/resource.entity';

/**
 * Activity of type theory model in the database
 * @author Enric Solevila
 */
export class ActivityTheory extends Activity {
	/** Id of the resource of the activity */
	resourceId?: string;

	/** Resource of the activity */
	@Type(() => ResourceTheory)
	resource?: ResourceTheory;

	/** Allowed types of resources inside the activity */
	readonly allowedResources: [RESOURCE_TYPE, ...Array<string>] = [
		RESOURCE_TYPE.THEORY,
	];
}
