import { Resource } from '../resource.entity';

/**
 * Activity of type Slides model in the database
 * @author Maxime Gazzé
 */
export class ResourcePdf extends Resource {
	/** Url of the file */
	url: string;

	/** File extension */
	extension: string;
}
