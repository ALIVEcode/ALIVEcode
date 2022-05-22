import { ButtonVariants } from '../Buttons/buttonTypes';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import React from 'react';

export interface ModalProps {
	open: boolean;
	setOpen: (bool: boolean) => void;
	title?: string;
	size?: 'sm' | 'md' | 'lg' | 'xl';
	unclosable?: boolean;
	submitButtonVariant?: ButtonVariants;
	closeButtonVariant?: ButtonVariants;
	hideCloseButton?: boolean;
	hideSubmitButton?: boolean;
	submitText?: string;
	closeText?: string;
	closeCross?: boolean;
	children?: React.ReactNode;
	hideTitle?: boolean;
	hideFooter?: boolean;
	centeredText?: boolean;
	centered?: boolean;
	backdropClassName?: string;
	dialogClassName?: string;
	contentClassName?: string;
	onKeyDownEnter?: () => void;
	icon?: IconProp;
	onShow?: () => void;
	topBar?: JSX.Element;
}

export type TimelineModalProps = Omit<ModalProps, 'hideTitle'> & {
	title: string;
	children: React.ReactNode | React.ReactNode[];
	defaultSlideClassName?: string;
	onCancel?: () => void;
	onSubmit?: () => Promise<void | boolean>;
	submitText?: string;
	submitButtonVariant?: 'primary' | 'secondary';
};

export type TimelinePageProps = {
	goNextWhen?: boolean;
	autoNext?: boolean;
	canGoNext?: boolean;
	title?: string;
	image?: string;
	text?: string;
	className?: string;
	children?: React.ReactNode;
};
