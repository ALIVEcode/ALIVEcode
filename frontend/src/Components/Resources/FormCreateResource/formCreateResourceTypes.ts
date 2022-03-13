import { RESOURCE_TYPE } from '../../../Models/Resource/resource.entity';
import { SUBJECTS } from '../../../Types/sharedTypes';

export type FormCreateResourceProps = {
	open: boolean;
	setOpen: (state: boolean) => void;
};

export type FormCreateResourceDTO = {
	type: RESOURCE_TYPE;
	resource: {
		name: string;
		url?: string;
		extension?: string;
		subject: SUBJECTS;
	};
};
