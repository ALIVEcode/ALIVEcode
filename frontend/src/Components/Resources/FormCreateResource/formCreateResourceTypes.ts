import { RESOURCE_TYPE } from '../../../Models/Resource/resource.entity';
import { SUBJECTS } from '../../../Types/sharedTypes';
export type FormCreateResourceDTO = {
	type: RESOURCE_TYPE;
	resource: {
		name: string;
		url?: string;
		extension?: string;
		subject: SUBJECTS;
	};
};
