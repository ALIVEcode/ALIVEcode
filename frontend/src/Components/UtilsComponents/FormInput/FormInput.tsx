import React from 'react';
import { FieldError } from 'react-hook-form';
import { classNames } from '../../../Types/utils';
import { FormInputProps } from './formInputTypes';

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
	progress?: number;
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
 * @author Enric Soldevila
 */
const FormInput = React.forwardRef<any, FormInputProps>(
	({ className, errors, progress, ...props }, ref) => {
		if (props.as === 'select')
			return (
				<select
					className={classNames(
						'shadow border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-[color:var(--fg-shade-two-color)] bg-[color:var(--background-color)] border-[color:var(--bg-shade-four-color)]',
						errors && 'border-red-500',
						className,
					)}
					ref={ref}
					{...props}
				/>
			);

		if (props.as === 'textarea')
			return (
				<textarea
					className={classNames(
						'shadow border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-[color:var(--fg-shade-two-color)] bg-[color:var(--background-color)] border-[color:var(--bg-shade-four-color)]',
						errors && 'border-red-500',
						className,
					)}
					ref={ref}
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
					{...props}
				/>
			);
		}

		if (props.type === 'file') {
			return (
				<div className="relative w-full">
					<div className="absolute rounded bg-[color:var(--background-color)] w-full h-full z-[-2]" />
					<div
						className={classNames(
							'absolute rounded h-full z-[-2]',
							errors
								? 'w-[0] border-red-500'
								: `w-[${progress}%] bg-[color:var(--logo-color)]`,
						)}
					/>
					<input
						className={classNames(
							'shadow border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-[color:var(--fg-shade-two-color)]',
							errors
								? 'border-red-500'
								: 'border-[color:var(--bg-shade-four-color)]',
							className,
						)}
						ref={ref}
						{...props}
					/>
				</div>
			);
		}

		return (
			<input
				className={classNames(
					'shadow border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-[color:var(--fg-shade-two-color)] bg-[color:var(--background-color)]',
					errors
						? 'border-red-500'
						: 'border-[color:var(--bg-shade-four-color)]',
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);

export default FormInput;
