import { PopupProps } from 'reactjs-popup/dist/types';
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { ModalProps } from '../UtilsComponents/Modal/modalTypes';
import { RefObject } from 'react';

export type InfoIconProps = {
	children?: JSX.Element;
	tooltip?: string;
	noTooltip?: boolean;
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
	useDefaultStyle?: boolean;
} & (
	| { children: JSX.Element; text?: never }
	| { children?: never; text: string }
);

export type InfoSlidesProps = Omit<ModalProps, 'hideTitle'> & {
	title: string;
	children: JSX.Element | JSX.Element[];
	defaultSlideClassName?: string;
};
export type InfoSlideProps = {
	title?: string;
	image?: string;
	text?: string;
	className?: string;
	children?: JSX.Element;
};

export type InfoTutorialTarget = {
	ref: RefObject<HTMLElement>;
	infoBox: JSX.Element;
	position?: PopupProps['position'];
	afterDo?: () => void;
};
export type InfoTutorialAction =
	| { target: InfoTutorialTarget; do?: never }
	| { target?: never; do: () => void };

export type InfoTutorialProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
	targets: InfoTutorialTarget[];
};
