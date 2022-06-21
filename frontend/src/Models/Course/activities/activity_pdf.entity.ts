import { Type } from 'class-transformer';
import { Activity } from '../activity.entity';
import { ResourcePdf } from '../../Resource/resources/resource_pdf.entity';
import { RESOURCE_TYPE } from '../../Resource/resource.entity';

/**
 * Activity of type Pdf model in the database
 * @author Maxime Gazzé
 */
export class ActivityPdf extends Activity {
	/** Id of the resource of the activity */
	resourceId?: string;

	/** Resource of the activity */
	@Type(() => ResourcePdf)
	resource?: ResourcePdf;

	/** Allowed types of resources inside the activity */
	readonly allowedResources: RESOURCE_TYPE[] = [RESOURCE_TYPE.PDF];

	/** Mime types allowed as a resource inside the activity */
	acceptedMimeTypes = ['application/pdf', 'application/vnd.ms-excel'];
}
