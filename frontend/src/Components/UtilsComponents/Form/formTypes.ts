import { AxiosResponse } from "axios";


export enum MATCHES {
	ALPHANUMERIC = 'ALPHANUMERIC',
	ALPHANUMERIC_UNDERSCORE = 'ALPHANUMERIC_UNDERSCORE',
	NUMBERS = 'NUMBERS',
	ALPHABETIC = 'ALPHABETIC',
	ALPHABETIC_LOWER = 'ALPHABETIC_LOWER',
	ALPHABETIC_UPPER = 'ALPHABETIC_UPPER',
}

export const matches = {
	ALPHANUMERIC: /^[a-zA-Z0-9]*$/,
	ALPHANUMERIC_UNDERSCORE: /^[a-zA-Z0-9_]*$/,
	NUMBERS: /^[0-9]*$/,
	ALPHABETIC: /^[a-zA-Z]*$/,
	ALPHABETIC_LOWER: /^[a-z]*$/,
	ALPHABETIC_UPPER: /^[A-Z]*$/,
};

export enum FORM_ACTION {
	POST = 'POST',
	DELETE = 'DELETE',
	PATCH = 'PATCH',
}

export type FormProps = {
	name: string;
	url: string;
	action: FORM_ACTION;
	onSubmit?: (response: AxiosResponse<any>) => void;
	inputGroups: Array<InputGroup>;
	alterFormValues?: (formValues: any) => any;
	disabled?: boolean;
};

export type InputGroup = {
	required?: boolean;
	minLength?: number;
	maxLength?: number;
	customMatch?: RegExp;
	match?: MATCHES;
	default?: any;
	name: string;
	disabled?: boolean;
	selectOptions?:
		| Array<any>
		| Array<{ value: string; display: string }>
		| { [key: string]: any };
	inputType:
		| 'checkbox'
		| 'color'
		| 'date'
		| 'select'
		| 'textarea'
		| 'datetime-local'
		| 'email'
		| 'file'
		| 'hidden'
		| 'image'
		| 'month'
		| 'number'
		| 'password'
		| 'radio'
		| 'range'
		| 'tel'
		| 'text'
		| 'time'
		| 'url'
		| 'week';
};