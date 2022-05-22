import { Resource } from '../../../Models/Resource/resource.entity';
import { ResourceMenuMode } from '../../../Pages/ResourceMenu/resourceMenuTypes';

export type ResourceCardProps = {
	resource: Resource;
	mode?: ResourceMenuMode;
	onSelectResource?: (resource: Resource) => void;
};
