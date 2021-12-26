import { ButtonVariants } from '../Button/buttonTypes';
import { AxiosResponse } from 'axios';

export type FormModalProps = {
	title: string;
	open: boolean;
	buttonVariant?: ButtonVariants;
	closeButton?: boolean;
	children: React.ReactNode;
	onClose: () => void;
	onSubmit?: (res: AxiosResponse<any>) => void;
};