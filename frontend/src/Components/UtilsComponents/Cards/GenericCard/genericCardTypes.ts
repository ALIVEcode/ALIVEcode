
export type GenericCardProps = {
	img?: string;
	to?: string;
	title?: string;
	style?: any;
	className?: string;
	onClick?: () => void;
};

export type CardStyles = {
	width: number;
	height: number;
	margin: string;
	boxShadow?: string;
	scale?: number;
};