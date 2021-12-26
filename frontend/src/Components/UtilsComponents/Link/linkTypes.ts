
export type StyledLinkProps = {
	dark?: boolean;
	pale?: boolean;
	bold?: boolean;
	block?: boolean;
};

export type LinkProps = {
	children?: React.ReactChildren | React.ReactElement | string;
	className?: string;
	to?: string;
	onClick?: () => void;
	style?: any;
	dark?: boolean;
	bold?: boolean;
	block?: boolean;
	pale?: boolean;
};