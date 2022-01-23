import React from 'react';
import { FieldError } from 'react-hook-form';
import { classNames } from '../../../Types/utils';
import { useTranslation } from 'react-i18next';
import FormLabel from '../FormLabel/FormLabel';
import FormInput from '../FormInput/FormInput';

type SelectProps = {
	errors: FieldError | undefined;
	label: string;
	messages?: { [key: string]: string };
	minLength?: number;
	maxLength?: number;
	as?: 'select';
};

type FullSelectProps = SelectProps &
	React.DetailedHTMLProps<
		React.SelectHTMLAttributes<HTMLSelectElement>,
		HTMLSelectElement
	>;

type InputProps = {
	errors: FieldError | undefined;
	label: string;
	messages?: { [key: string]: string };
	as?: 'select';
};

type FullInputProps = InputProps &
	React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	>;

type Props = FullSelectProps | FullInputProps;

/**
 * Styled Group for label and input
 *
 * @author MoSk3
 */
const InputGroup = React.forwardRef<any, any>(
	(
		{
			errors,
			messages,
			className,
			label,
			labelClassName,
			inputClassName,
			name,
			minLength,
			maxLength,
			...props
		},
		ref,
	) => {
		const { t } = useTranslation();

		const getGenericError = () => {
			if (!errors) return;
			if (errors?.type === 'required') return t('form.error.required');
			if (errors?.type === 'minLength') {
				if (minLength != null)
					return t('form.error.minLength', { min: minLength });
				return t('form.error.too_short');
			}

			if (errors?.type === 'maxLength') {
				if (maxLength != null)
					return t('form.error.maxLength', { max: maxLength });
				return t('form.error.too_long');
			}
			return t('form.error.generic');
		};

		return (
			<div className={'mb-2 w-full ' + className}>
				<FormLabel htmlFor={name} className={labelClassName}>
					{label}
				</FormLabel>
				<FormInput
					minLength={minLength}
					maxLength={maxLength}
					ref={ref}
					name={name}
					className={inputClassName}
					errors={errors}
					{...props}
				/>
				<p className="text-red-500 text-sm italic mt-1">
					{errors &&
						messages &&
						(errors.type in messages
							? messages[errors.type]
							: getGenericError())}
				</p>
			</div>
		);
	},
);

export default InputGroup;
