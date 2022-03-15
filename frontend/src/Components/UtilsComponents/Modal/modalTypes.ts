import { ButtonVariants } from '../Buttons/buttonTypes';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import React from 'react';

export interface ModalProps {
	open: boolean;
	setOpen: (bool: boolean) => void;
	title?: string;
	size?: 'sm' | 'lg' | 'xl';
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
	icon?: IconProp;
	onShow?: () => void;
}
