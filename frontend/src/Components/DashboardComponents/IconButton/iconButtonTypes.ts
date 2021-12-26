import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

export interface IconButtonProps extends FontAwesomeIconProps {
	onClick?: () => void;
	to?: string;
	children?: string;
}