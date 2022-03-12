import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ResourceMenuSections } from '../../../Pages/ResourceMenu/resourceMenuTypes';

export type ResourceSectionProps = {
	name: string;
	icon: IconDefinition;
	section: ResourceMenuSections;
};
