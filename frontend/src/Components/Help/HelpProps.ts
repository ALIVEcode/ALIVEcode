import { PopupProps } from 'reactjs-popup/dist/types';
import { FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { ModalProps } from '../UtilsComponents/Modal/modalTypes';
import React from 'react';
import Tutorial from './Tutorial';
import Page = Tutorial.Page;

export type InfoButtonProps = {
	children?: JSX.Element;
	hideDefaultStyle?: boolean;
	className?: string;
	icon?: {
		onClick?: () => void;
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

export type TutorialTimelineProps = ModalProps & {
	children:
		| React.ReactElement<TutorialPageProps, typeof Page>
		| React.ReactElement<TutorialPageProps, typeof Page>[];
};

export type TutorialPageProps = { title: string };
