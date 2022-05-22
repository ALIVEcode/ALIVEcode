import { Exclude } from 'class-transformer';
import { SUBJECTS } from '../../Types/sharedTypes';
import { Professor } from '../User/user.entity';
import { ResourceChallenge } from './resources/resource_challenge.entity';
import { ResourceTheory } from './resources/resource_theory.entity';
import { ResourceFile } from './resources/resource_file.entity';
import { ResourcePdf } from './resources/resource_pdf.entity';
import { ResourceVideo } from './resources/resource_video.entity';
import { commonColors } from '../../state/contexts/ThemeContext';
import {
	faFilePdf,
	faFile,
	faCode,
	faVideo,
	faBook,
	faQuestion,
} from '@fortawesome/free-solid-svg-icons';

/** Enum of all the type of resources */
export enum RESOURCE_TYPE {
	THEORY = 'TH',
	PDF = 'PF',
	VIDEO = 'VI',
	CHALLENGE = 'CH',
	FILE = 'FI',
}

/** Typing for all different type of resources */
export type DifferentResources =
	| ResourceChallenge
	| ResourceTheory
	| ResourceFile
	| ResourcePdf
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

	get color() {
		return getResourceColor(this.type);
	}

	isFile() {
		return (this as any).fileId ? true : false;
	}
}

/**
 * Gets the icon of a resource
 * @param subject Type of the resource to get the icon of
 * @returns The good display icon
 * @author Enric Soldevila
 */
export const getResourceIcon = (resourceType: RESOURCE_TYPE) => {
	switch (resourceType) {
		case RESOURCE_TYPE.FILE:
			return faFile;
		case RESOURCE_TYPE.PDF:
			return faFilePdf;
		case RESOURCE_TYPE.CHALLENGE:
			return faCode;
		case RESOURCE_TYPE.VIDEO:
			return faVideo;
		case RESOURCE_TYPE.THEORY:
			return faBook;
	}
	return faQuestion;
};

export const getResourceColor = (resourceType: RESOURCE_TYPE): string => {
	switch (resourceType) {
		case RESOURCE_TYPE.CHALLENGE:
			return commonColors.challenge;
		case RESOURCE_TYPE.THEORY:
			return commonColors.theory;
		case RESOURCE_TYPE.VIDEO:
			return commonColors.video;
		case RESOURCE_TYPE.PDF:
			return commonColors.pdf;
		case RESOURCE_TYPE.FILE:
			return 'var(--fg-shade-four-color)';
	}
	return 'var(--fg-shade-four-color)';
};
