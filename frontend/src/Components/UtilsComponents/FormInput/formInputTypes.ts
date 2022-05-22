import { MakeCompatible, OneOf } from '../../../Types/utils';

type BaseFormInputProps = {
	className: string;
	errors?: {
		type: string;
	};
	name: string;
};

export type FormInputProps = BaseFormInputProps &
	MakeCompatible<
		[
			{
				type: 'file';
				progress: number;
			},
			{ type: 'checkbox' },

			{ as: 'select' },
			{
				as: 'textarea';
				minLength: number;
				maxLength: number;
			},
		]
	> &
	any;
