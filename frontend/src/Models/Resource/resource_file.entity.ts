import { Resource } from './resource.entity';

/**
 * Activity of type File model in the database
 * @author Enric Solevila
 */
export class ResourceFileEntity extends Resource {
	/** Url of the file */
	url: string;

	/** File extension */
	extension: string;
}
