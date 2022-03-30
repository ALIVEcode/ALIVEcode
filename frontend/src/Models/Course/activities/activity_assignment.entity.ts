import { Activity } from '../activity.entity';
import { Type } from 'class-transformer';
import { ResourceFile } from '../../Resource/resources/resource_file.entity';
import { RESOURCE_TYPE } from '../../Resource/resource.entity';

/**
 * Activity of type Assignment model in the database
 * @author Enric Solevila
 */
export class ActivityAssignment extends Activity {
	/** Id of the resource of the activity */
	resourceId?: string;

	/** Resource of the activity */
	@Type(() => ResourceFile)
	resource?: ResourceFile;

	/** Allowed types of resources inside the activity */
	readonly allowedResources: RESOURCE_TYPE[] = [RESOURCE_TYPE.FILE];
}
