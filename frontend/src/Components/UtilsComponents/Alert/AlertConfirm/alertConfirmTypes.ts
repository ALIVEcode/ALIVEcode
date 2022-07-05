import { ModalProps } from '../../Modal/modalTypes';

export interface AlertConfirmProps extends ModalProps {
	onConfirm?: () => void;
	onCancel?: () => void;
	secureConfirmation?: {
		type: 'text' | 'checkbox';
		comparisonValue?: string;
		placeholder?: string;
		title: string;
	};
	irreversibleText?: boolean;
}
