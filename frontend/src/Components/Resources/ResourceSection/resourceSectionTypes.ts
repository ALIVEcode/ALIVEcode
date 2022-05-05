import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { ResourceMenuSubjects } from '../../../Pages/ResourceMenu/resourceMenuTypes';

export type ResourceSectionProps = {
	name: string;
	icon: IconDefinition;
	section: ResourceMenuSubjects;
};
