import { createContext } from 'react';
import { RESOURCE_TYPE } from '../../Models/Resource/resource.entity';
import {
	ResourceMenuMode,
	ResourceMenuSubjects,
} from '../../Pages/ResourceMenu/resourceMenuTypes';

export type ResourceMenuContextValues = {
	selectedSubject: ResourceMenuSubjects;
	mode: ResourceMenuMode;
	setSelectedSubject: (subject: ResourceMenuSubjects) => void;
	selectedFilters: RESOURCE_TYPE[];
	setSelectedFilters: (filters: RESOURCE_TYPE[]) => void;
	isFilterSelected: (filter: RESOURCE_TYPE) => boolean;
	toggleFilter: (filter: RESOURCE_TYPE) => void;
};

export const ResourceMenuContext = createContext<ResourceMenuContextValues>({
	selectedSubject: 'all',
	mode: 'default',
	setSelectedSubject: () => {},
	selectedFilters: [],
	setSelectedFilters: () => {},
	isFilterSelected: () => false,
	toggleFilter: () => {},
});
