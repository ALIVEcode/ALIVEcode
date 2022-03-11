import { Exclude } from 'class-transformer';
import {
	faFile,
	faImage,
	faCode,
	faVideo,
} from '@fortawesome/free-solid-svg-icons';
import { SUBJECTS } from '../../Types/sharedTypes';
import { Professor } from '../User/user.entity';

export enum RESOURCE_TYPE {
	VIDEO = 'VI',
	FILE = 'FI',
	IMAGE = 'IM',
	CHALLENGE = 'CH',
}

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
		}
	}
}
