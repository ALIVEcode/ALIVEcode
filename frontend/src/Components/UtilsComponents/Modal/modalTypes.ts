import { ButtonVariants } from '../Button/buttonTypes';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export interface ModalProps {
	title: string;
	open: boolean;
	setOpen: (bool: boolean) => void;
	size?: 'sm' | 'lg' | 'xl';
	buttonVariant?: ButtonVariants;
	closeCross?: boolean;
	hideCloseButton?: boolean;
	submitText?: string;
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
