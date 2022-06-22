import { Exclude, Type } from 'class-transformer';
import { SUBJECTS } from '../../Types/sharedTypes';
import { Professor } from '../User/user.entity';
import { ResourceChallenge } from './resources/resource_challenge.entity';
import { ResourceTheory } from './resources/resource_theory.entity';
import { ResourceFile } from './resources/resource_file.entity';
import { ResourceVideo } from './resources/resource_video.entity';
import { commonColors } from '../../state/contexts/ThemeContext';
import {
	faFile,
	faCode,
	faVideo,
	faBook,
	faQuestion,
	faFilePdf,
	faFileWord,
	faFilePowerpoint,
	faFileImage,
} from '@fortawesome/free-solid-svg-icons';
import { File } from './resources/file.entity';

export const wordMimeTypes = [
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const pdfMimeTypes = ['application/pdf', 'application/vnd.ms-excel'];

export const imageMimeTypes = [
	'image/gif',
	'image/jpeg',
	'image/jpg',
	'image/webp',
	'image/tiff',
	'image/png',
	'image/svg+xml',
];

export const powerpointMimeTypes = [
	'application/vnd.ms-powerpoint',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
];

/** Enum of all the type of resources */
export enum RESOURCE_TYPE {
	THEORY = 'TH',
	VIDEO = 'VI',
	CHALLENGE = 'CH',
	FILE = 'FI',
}

/** Typing for all different type of resources */
export type DifferentResources =
	| ResourceChallenge
	| ResourceTheory
	| ResourceFile
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

	@Type(() => File)
	file?: File;

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
		if (this.type === RESOURCE_TYPE.FILE && this.file)
			return getResourceIcon(this.type, this.file.mimetype);

		return getResourceIcon(this.type);
	}

	get color() {
		if (this.type === RESOURCE_TYPE.FILE && this.file)
			return getResourceColor(this.type, this.file.mimetype);

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
export const getResourceIcon = (
	resourceType: RESOURCE_TYPE,
	mimeType?: string,
) => {
	// File icons
	if (resourceType === RESOURCE_TYPE.FILE) {
		if (!mimeType) return faFile;
		if (pdfMimeTypes.includes(mimeType)) return faFilePdf;
		if (wordMimeTypes.includes(mimeType)) return faFileWord;
		if (powerpointMimeTypes.includes(mimeType)) return faFilePowerpoint;
		if (imageMimeTypes.includes(mimeType)) return faFileImage;
		return faFile;
	}

	// Other icons
	switch (resourceType) {
		case RESOURCE_TYPE.CHALLENGE:
			return faCode;
		case RESOURCE_TYPE.VIDEO:
			return faVideo;
		case RESOURCE_TYPE.THEORY:
			return faBook;
	}
	return faQuestion;
};

/**
 * Gets the color of a resource
 * @param subject Type of the resource to get the color of
 * @returns The good display color
 * @author Enric Soldevila
 */
export const getResourceColor = (
	resourceType: RESOURCE_TYPE,
	mimeType?: string,
): string => {
	// File icons
	if (resourceType === RESOURCE_TYPE.FILE) {
		if (!mimeType) return 'var(--fg-shade-four-color)';
		if (pdfMimeTypes.includes(mimeType)) return commonColors.pdf;
		if (wordMimeTypes.includes(mimeType)) return commonColors.word;
		if (powerpointMimeTypes.includes(mimeType)) return commonColors.powerpoint;
		return 'var(--fg-shade-four-color)';
	}

	/** Other icons */
	switch (resourceType) {
		case RESOURCE_TYPE.CHALLENGE:
			return commonColors.challenge;
		case RESOURCE_TYPE.THEORY:
			return commonColors.theory;
		case RESOURCE_TYPE.VIDEO:
			return commonColors.video;
	}
	return 'var(--fg-shade-four-color)';
};
