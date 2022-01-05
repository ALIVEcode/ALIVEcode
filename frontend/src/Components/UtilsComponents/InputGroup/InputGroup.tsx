import React from 'react';
import { FieldError } from 'react-hook-form';
import { classNames } from '../../../Types/utils';
import { useTranslation } from 'react-i18next';
import FormLabel from '../FormLabel/FormLabel';

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
			className,
			errors,
			messages,
			label,
			name,
			minLength,
			maxLength,
			defaultChecked,
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

		const generateInput = () => {
			if (props.as === 'select')
				return (
					<select
						className={classNames(
							'shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-[color:var(--fg-shade-two-color)] bg-[color:var(--background-color)] border-[color:var(--bg-shade-four-color)]',
							errors && 'border-red-500',
							className,
						)}
						ref={ref}
						name={name}
						{...props}
					/>
				);

			if (props.as === 'textarea')
				return (
					<textarea
						className={classNames(
							'shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-[color:var(--fg-shade-two-color)] bg-[color:var(--background-color)] border-[color:var(--bg-shade-four-color)]',
							errors && 'border-red-500',
							className,
						)}
						ref={ref}
						name={name}
						{...props}
					/>
				);

			if (props.type === 'checkbox') {
				return (
					<input
						className={classNames(
							'h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 align-top bg-no-repeat bg-center bg-contain cursor-pointer',
							errors && 'border-red-500',
							className,
						)}
						ref={ref}
						name={name}
						{...props}
					/>
				);
			}

			return (
				<input
					className={classNames(
						'shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-[color:var(--fg-shade-two-color)] bg-[color:var(--background-color)] border-[color:var(--bg-shade-four-color)]',
						errors && 'border-red-500',
						className,
					)}
					ref={ref}
					name={name}
					{...props}
				/>
			);
		};

		return (
			<div className="mb-2 w-full">
				<FormLabel htmlFor={name}>{label}</FormLabel>
				{generateInput()}
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
