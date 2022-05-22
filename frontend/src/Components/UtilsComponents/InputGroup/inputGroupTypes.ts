import { FormInputProps } from '../FormInput/formInputTypes';

export type InputGroupProps = FormInputProps & {
	messages: {
		[type: string]: string;
	};
	label: string;
	labelClassName: string;
	inputClassName: string;
};
