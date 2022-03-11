import { Resource } from './resource.entity';

/**
 * Activity of type Image model in the database
 * @author Enric Solevila
 */
export class ResourceImageEntity extends Resource {
	/** Url of the image */
	url: string;
}
