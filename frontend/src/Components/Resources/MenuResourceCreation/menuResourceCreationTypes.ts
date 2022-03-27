import {
	RESOURCE_TYPE,
	Resource,
} from '../../../Models/Resource/resource.entity';
import { SUBJECTS } from '../../../Types/sharedTypes';
import { Descendant } from 'slate';

export type MenuResourceCreationProps = {
	open: boolean;
	setOpen: (state: boolean) => void;
	updateMode?: boolean;
	defaultResource?: Resource;
};

export type MenuResourceCreationDTO = {
	uuid: string;
	type: RESOURCE_TYPE;
	resource: {
		name: string;
		url?: string;
		document?: Descendant[];
		extension?: string;
		subject: SUBJECTS;
		challengeId?: string;
	};
};
