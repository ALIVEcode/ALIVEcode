import { Type } from 'class-transformer';
import { Activity } from '../activity.entity';
import {
	RESOURCE_TYPE,
	powerpointMimeTypes,
} from '../../Resource/resource.entity';
import { ResourceFile } from '../../Resource/resources/resource_file.entity';

/**
 * Activity of type PowerPoint model in the database
 * @author Enric Solevila
 */
export class ActivityPowerPoint extends Activity {
	/** Id of the resource of the activity */
	resourceId?: string;

	/** Resource of the activity */
	@Type(() => ResourceFile)
	resource?: ResourceFile;

	/** Allowed types of resources inside the activity */
	readonly allowedResources: RESOURCE_TYPE[] = [RESOURCE_TYPE.FILE];

	/** Mime types allowed as a resource inside the activity */
	acceptedMimeTypes = powerpointMimeTypes;
}
