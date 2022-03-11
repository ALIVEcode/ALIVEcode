import { RESOURCE_TYPE } from '../../../Models/Resource/resource.entity';
export type FormCreateResourceDTO = {
	type: RESOURCE_TYPE;
	resource: {
		name: string;
	};
};
