import { ButtonVariants } from '../Button/buttonTypes';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface ModalProps {
	title: string;
	open: boolean;
	setOpen: (bool: boolean) => void;
	size?: 'sm' | 'lg' | 'xl';
	submitButtonVariant?: ButtonVariants;
	closeButtonVariant?: ButtonVariants;
	hideCloseButton?: boolean;
	hideSubmitButton?: boolean;
	submitText?: string;
	closeText?: string;
	closeCross?: boolean;
	children?: React.ReactNode;
	hideFooter?: boolean;
	centeredText?: boolean;
	centered?: boolean;
	backdropClassName?: string;
	dialogClassName?: string;
	contentClassName?: string;
	icon?: IconProp;
	onShow?: () => void;
}
