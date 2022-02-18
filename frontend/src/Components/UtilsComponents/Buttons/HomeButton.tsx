import Button from './Button';
import React, { FC } from 'react';
import { ButtonProps } from './buttonTypes';

export const HomeButton: FC<
	Partial<ButtonProps> &
		React.DetailedHTMLProps<
			React.ButtonHTMLAttributes<HTMLButtonElement>,
			HTMLButtonElement
		>
> = ({ className, ...props }) => {
	return (
		<Button
			variant="primary"
			className={
				'bg-[#2512FF] hover:bg-[#1241ff] !px-5 !py-3 rounded-full text-2xl tracking-wide !transition-all shadow-[0_4px_4px_0px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_6px_1px_rgba(0,0,0,0.3)] font-normal ' +
				className
			}
			{...props}
		></Button>
	);
};
