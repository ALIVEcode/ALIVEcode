import { PopupProps } from 'reactjs-popup/dist/types';
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';

export type InfoButtonProps = {
	children?: JSX.Element;
	hideDefaultStyle?: boolean;
	className?: string;
	icon?: {
		className?: string;
		hideDefaultStyle?: boolean;
		size?: FontAwesomeIconProps['size'];
	};
	hoverPopup?: {
		text?: string;
		textClassName?: string;
		hideDefaultStyle?: boolean;
		position: PopupProps['position'];
		className?: string;
		content?: JSX.Element;
		offset?: { x?: number; y?: number };
	};
	modalOnClick?: {};
};
