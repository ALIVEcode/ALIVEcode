import { Exclude } from 'class-transformer';
import { SUBJECTS, getResourceIcon } from '../../Types/sharedTypes';
import { Professor } from '../User/user.entity';
import { ResourceChallenge } from './resources/resource_challenge.entity';
import { ResourceTheory } from './resources/resource_theory.entity';
import { ResourceFile } from './resources/resource_file.entity';
import { ResourceImage } from './resources/resource_image.entity';
import { ResourceVideo } from './resources/resource_video.entity';

/** Enum of all the type of resources */
export enum RESOURCE_TYPE {
	VIDEO = 'VI',
	FILE = 'FI',
	IMAGE = 'IM',
	CHALLENGE = 'CH',
	THEORY = 'TH',
}

/** Typing for all different type of resources */
export type DifferentResources =
	| ResourceChallenge
	| ResourceTheory
	| ResourceFile
	| ResourceImage
	| ResourceVideo;

/**
 * Generic resource model in the database
 * @author Enric Soldevila
 */
export class Resource {
	/** Id of the resource */
	@Exclude({ toPlainOnly: true })
	id: string;

	/** Name of the resource */
	name: string;

	/** Type of the resource */
	type: RESOURCE_TYPE;

	/** Subject of the resource */
	subject: SUBJECTS;

	/** Creation date of the resource */
	@Exclude({ toPlainOnly: true })
	creationDate: Date;

	/** Update date of the resource */
	@Exclude({ toPlainOnly: true })
	updateDate: Date;

	/** Creator of the resource */
	@Exclude({ toPlainOnly: true })
	creator: Professor;

	/**
	 * Gets the display icon of the resource depending on its type
	 * @author Enric Soldevila
	 */

	getIcon() {
		return getResourceIcon(this.type);
	}
}
