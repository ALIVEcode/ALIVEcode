import { createContext } from 'react';
import {
	ResourceMenuMode,
	ResourceMenuSubjects,
} from '../../Pages/ResourceMenu/resourceMenuTypes';

export type ResourceMenuContextValues = {
	selectedSubject: ResourceMenuSubjects;
	mode: ResourceMenuMode;
	setSelectedSubject: (subject: ResourceMenuSubjects) => void;
	selectedFilters: string[];
	setSelectedFilters: (filters: string[]) => void;
	isFilterSelected: (filter: string) => boolean;
	toggleFilter: (filter: string) => void;
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
