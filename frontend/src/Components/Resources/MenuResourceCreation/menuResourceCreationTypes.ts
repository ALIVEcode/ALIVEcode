import {
	RESOURCE_TYPE,
	Resource,
} from '../../../Models/Resource/resource.entity';
import { SUBJECTS } from '../../../Types/sharedTypes';

export type MenuResourceCreationProps = {
	open: boolean;
	setOpen: (state: boolean) => void;
	updateMode?: boolean;
	defaultResource?: Resource;
};

export type MenuResourceCreationDTO = {
	type: RESOURCE_TYPE;
	resource: {
		name: string;
		url?: string;
		extension?: string;
		subject: SUBJECTS;
		challengeId?: string;
	};
};
