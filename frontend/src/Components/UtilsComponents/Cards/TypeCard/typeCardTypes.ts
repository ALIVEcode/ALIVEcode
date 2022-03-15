import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type TypeCardProps = {
	img?: string;
	alt?: string;
	icon?: IconDefinition;
	title: string;
	onClick: () => void;
	selected?: boolean;
};
