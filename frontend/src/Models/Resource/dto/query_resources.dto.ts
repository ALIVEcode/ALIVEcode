import { SUBJECTS } from '../../../Types/sharedTypes';
import { RESOURCE_TYPE } from '../resource.entity';

/** DTO to query the resources in the ResourceMenu */
export class QueryResources {
	name?: string;
	types?: RESOURCE_TYPE[];
	subject?: SUBJECTS;
}
