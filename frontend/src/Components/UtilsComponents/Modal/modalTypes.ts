import { ButtonVariants } from '../Button/buttonTypes';
import { ModalProps as BootModalProps } from 'react-bootstrap';

export interface ModalProps extends BootModalProps {
	title: string;
	open: boolean;
	size?: 'sm' | 'lg' | 'xl';
	buttonVariant?: ButtonVariants;
	closeCross?: boolean;
	hideCloseButton?: boolean;
	submitText?: string;
	children?: React.ReactNode;
	hideFooter?: boolean;
	onClose: () => void;
	centeredText?: boolean;
};