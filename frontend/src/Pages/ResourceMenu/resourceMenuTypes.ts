import { Resource, RESOURCE_TYPE } from '../../Models/Resource/resource.entity';
import { SUBJECTS } from '../../Types/sharedTypes';

/** The possible ResourceMenu's subjects */
export type ResourceMenuSubjects = SUBJECTS | 'all';

/** The possible ResourceMenu's mode */
export type ResourceMenuMode = 'default' | 'import';

/** Props of the ResourceMenu component */
export type ResourceMenuProps = {
	mode?: ResourceMenuMode;
	filters?: RESOURCE_TYPE[];
	onSelectResource?: (resource: Resource) => void;
};
