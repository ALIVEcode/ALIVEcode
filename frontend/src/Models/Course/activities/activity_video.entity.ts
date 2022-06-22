import { Type } from 'class-transformer';
import { Activity } from '../activity.entity';
import { ResourceVideo } from '../../Resource/resources/resource_video.entity';
import { RESOURCE_TYPE } from '../../Resource/resource.entity';

export const acceptedVideoMimeTypes = [
	'video/mp4',
	'video/x-m4v',
	'video/quicktime',
	'video/x-ms-wmv',
	'video/x-matroska',
	'video/mpeg',
	'video/ogg',
	'video/mp2t',
	'video/x-flv',
	'video/x-ms-asf',
];

/**
 * Activity of type Video model in the database
 * @author Enric Solevila
 */
export class ActivityVideo extends Activity {
	/** Id of the resource of the activity */
	resourceId?: string;

	/** Resource of the activity */
	@Type(() => ResourceVideo)
	resource?: ResourceVideo;

	/** Allowed types of resources inside the activity */
	readonly allowedResources: [RESOURCE_TYPE, ...Array<string>] = [
		RESOURCE_TYPE.VIDEO,
	];

	/** Mime types allowed as a resource inside the activity */
	acceptedMimeTypes = acceptedVideoMimeTypes;
}
