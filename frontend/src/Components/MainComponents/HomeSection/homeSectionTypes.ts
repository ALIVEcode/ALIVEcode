export type HomeSectionProps = {
	title: string;
	text: string;
	img: string;
	imgAlt: string;
	reverse?: boolean;
	button?: string;
	onClick?: () => void;
	imgOpacity?: number;
	to?: string;
	important?: boolean;
};
