import { Resource } from '../../Models/Resource/resource.entity';
import { SUBJECTS } from '../../Types/sharedTypes';

export type ResourceMenuSections = SUBJECTS | 'all';

export type ResourceMenuMode = 'default' | 'import';

export type ResourceMenuProps = {
	mode?: ResourceMenuMode;
	onSelectResource?: (resource: Resource) => void;
};
