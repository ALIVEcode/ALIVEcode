import { Exclude } from 'class-transformer';
import {
	faFile,
	faImage,
	faCode,
	faVideo,
	faQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { SUBJECTS } from '../../Types/sharedTypes';
import { Professor } from '../User/user.entity';
import { ResourceChallenge } from './resource_challenge.entity';
import { ResourceTheory } from './resource_theory.entity';
import { ResourceFile } from './resource_file.entity';
import { ResourceImage } from './resource_image.entity';
import { ResourceVideo } from './resource_video.entity';
import { faBook } from '@fortawesome/free-solid-svg-icons';

export enum RESOURCE_TYPE {
	VIDEO = 'VI',
	THEORY = 'TH',
	FILE = 'FI',
	IMAGE = 'IM',
	CHALLENGE = 'CH',
}

export type DifferentResources =
	| ResourceChallenge
	| ResourceTheory
	| ResourceFile
	| ResourceImage
	| ResourceVideo;

export class Resource {
	@Exclude({ toPlainOnly: true })
	id: string;

	name: string;

	type: RESOURCE_TYPE;

	category: SUBJECTS;

	creationDate: Date;

	updateDate: Date;

	@Exclude({ toPlainOnly: true })
	creator: Professor;

	getIcon() {
		switch (this.type) {
			case RESOURCE_TYPE.FILE:
				return faFile;
			case RESOURCE_TYPE.IMAGE:
				return faImage;
			case RESOURCE_TYPE.CHALLENGE:
				return faCode;
			case RESOURCE_TYPE.VIDEO:
				return faVideo;
			case RESOURCE_TYPE.THEORY:
				return faBook;
		}
		return faQuestion;
	}
}
