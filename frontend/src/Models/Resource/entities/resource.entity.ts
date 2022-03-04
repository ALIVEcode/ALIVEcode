import { Exclude } from 'class-transformer';
import { SUBJECTS } from '../../../Types/sharedTypes';
import { Professor } from '../../User/user.entity';

export enum RESOURCE_TYPE {
	VIDEO = 'VI',
	FILE = 'FI',
	IMAGE = 'IM',
	LEVEL = 'LE',
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
}
