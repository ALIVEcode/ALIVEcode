import { Type } from 'class-transformer';
import { RESOURCE_TYPE, pdfMimeTypes } from '../../Resource/resource.entity';
import { ResourceFile } from '../../Resource/resources/resource_file.entity';
import { Activity } from '../activity.entity';

/**
 * Activity of type Pdf model in the database
 * @author Maxime Gazzé
 */
export class ActivityPdf extends Activity {
	/** Id of the resource of the activity */
	resourceId?: string;

	/** Resource of the activity */
	@Type(() => ResourceFile)
	resource?: ResourceFile;

	/** Allowed types of resources inside the activity */
	readonly allowedResources: [RESOURCE_TYPE, ...Array<string>] = [
		RESOURCE_TYPE.FILE,
		'pdf',
	];

	/** Mime types allowed as a resource inside the activity */
	acceptedMimeTypes = pdfMimeTypes;

	startPage?: number;
	finishPage?: number;
}
