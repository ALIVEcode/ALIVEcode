import { PopupProps } from 'reactjs-popup/dist/types';
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { ModalProps } from '../UtilsComponents/Modal/modalTypes';

export type InfoIconProps = {
	children: JSX.Element;
	activateOnHover?: boolean;
	onClick?: () => void;
	className?: string;
	iconClassName?: string;
	ignoreDefaultIconStyle?: boolean;
	hoverPopup?: Omit<PopupProps, 'trigger' | 'on' | 'children'>;
	iconSize?: FontAwesomeIconProps['size'];
};

export type InfoBoxProps = {
	title?: string;
	className?: string;
	ignoreDefaultStyle?: boolean;
} & (
	| { children: JSX.Element; text?: never }
	| { children?: never; text: string }
);

export type InfoSlidesProps = Omit<ModalProps, 'hideTitle'> & {
	title: string;
	children: JSX.Element | JSX.Element[];
};
export type InfoSlideProps = {
	title?: string;
	image?: string;
	text?: string;
	className?: string;
	children?: JSX.Element;
};
