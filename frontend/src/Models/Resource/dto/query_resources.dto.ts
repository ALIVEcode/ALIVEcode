import { SUBJECTS } from '../../../Types/sharedTypes';
import { RESOURCE_TYPE } from '../resource.entity';

export const fileMimeTypesFilters = ['img', 'pdf', 'word'];

/** DTO to query the resources in the ResourceMenu */
export class QueryResources {
	name?: string;
	resourceTypes?: RESOURCE_TYPE[];
	fileMimeTypes?: string[];
	subject?: SUBJECTS;
}
