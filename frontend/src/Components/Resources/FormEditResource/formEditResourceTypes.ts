import {
	Resource,
	RESOURCE_TYPE,
} from '../../../Models/Resource/resource.entity';
import { SUBJECTS } from '../../../Types/sharedTypes';

export type FormEditResourceDTO = {
	type: RESOURCE_TYPE;
	resource: {
		name: string;
		url?: string;
		extension?: string;
		subject: SUBJECTS;
	};
};

export type FormEditResourceProps = {
	resource: Resource;
};
