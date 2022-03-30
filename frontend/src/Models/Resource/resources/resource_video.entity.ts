import { Resource } from '../resource.entity';

/**
 * Activity of type Video model in the database
 * @author Enric Solevila
 */
export class ResourceVideo extends Resource {
	/** Url of the video */
	url: string;
}
