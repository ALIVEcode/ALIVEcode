import { Resource } from '../resource.entity';
import { Descendant } from 'slate';

/**
 * Activity of type Theory model in the database
 * @author Enric Solevila
 */
export class ResourceTheory extends Resource {
	/** Content of the theory resource */
	document?: Descendant[];
}
