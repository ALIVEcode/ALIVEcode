import { SUBJECTS } from '../../../Types/sharedTypes';
import { RESOURCE_TYPE } from '../resource.entity';

export class QueryResources {
	name?: string;
	types?: RESOURCE_TYPE[];
	subject?: SUBJECTS;
}
