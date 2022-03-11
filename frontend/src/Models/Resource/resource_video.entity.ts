import { Resource } from './resource.entity';

/**
 * Activity of type Video model in the database
 * @author Enric Solevila
 */
export class ResourceVideoEntity extends Resource {
	/** Url of the video */
	url: string;
}
