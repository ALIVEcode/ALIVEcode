import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type TypeCardProps = {
	img?: string;
	alt?: string;
	icon?: IconDefinition;
	color?: string;
	tooltip?: string;
	title: string;
	onClick: () => void;
	selected?: boolean;
};
