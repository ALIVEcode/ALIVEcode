import { Exclude } from 'class-transformer';
import { SUBJECTS, getResourceIcon } from '../../Types/sharedTypes';
import { Professor } from '../User/user.entity';
import { ResourceChallenge } from './resource_challenge.entity';
import { ResourceTheory } from './resource_theory.entity';
import { ResourceFile } from './resource_file.entity';
import { ResourceImage } from './resource_image.entity';
import { ResourceVideo } from './resource_video.entity';

export enum RESOURCE_TYPE {
	VIDEO = 'VI',
	FILE = 'FI',
	IMAGE = 'IM',
	CHALLENGE = 'CH',
	THEORY = 'TH',
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

	subject: SUBJECTS;

	creationDate: Date;

	updateDate: Date;

	@Exclude({ toPlainOnly: true })
	creator: Professor;

	getIcon() {
		return getResourceIcon(this.type);
	}
}
