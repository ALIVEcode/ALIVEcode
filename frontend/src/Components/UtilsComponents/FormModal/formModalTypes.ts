import { AxiosResponse } from 'axios';
import { ModalProps } from '../Modal/modalTypes';

export interface FormModalProps extends ModalProps {
	closeButton?: boolean;
	onSubmit?: (res: AxiosResponse<any>) => void;
}
