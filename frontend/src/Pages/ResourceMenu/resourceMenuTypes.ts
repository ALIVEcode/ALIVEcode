import { Resource, RESOURCE_TYPE } from '../../Models/Resource/resource.entity';
import { SUBJECTS } from '../../Types/sharedTypes';

export type ResourceMenuSections = SUBJECTS | 'all';

export type ResourceMenuMode = 'default' | 'import';

export type ResourceMenuProps = {
	mode?: ResourceMenuMode;
	filters?: RESOURCE_TYPE[];
	onSelectResource?: (resource: Resource) => void;
};
