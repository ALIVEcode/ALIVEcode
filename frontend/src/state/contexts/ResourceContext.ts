import { createContext } from 'react';
import { RESOURCE_TYPE } from '../../Models/Resource/resource.entity';
import { ResourceMenuSections } from '../../Pages/ResourceMenu/resourceMenuTypes';

export type ResourceMenuContextValues = {
	selectedSection: ResourceMenuSections;
	setSelectedSection: (subject: ResourceMenuSections) => void;
	selectedFilters: RESOURCE_TYPE[];
	setSelectedFilters: (filters: RESOURCE_TYPE[]) => void;
	isFilterSelected: (filter: RESOURCE_TYPE) => boolean;
	toggleFilter: (filter: RESOURCE_TYPE) => void;
};

export const ResourceMenuContext = createContext<ResourceMenuContextValues>({
	selectedSection: 'all',
	setSelectedSection: () => {},
	selectedFilters: [],
	setSelectedFilters: () => {},
	isFilterSelected: () => false,
	toggleFilter: () => {},
});
