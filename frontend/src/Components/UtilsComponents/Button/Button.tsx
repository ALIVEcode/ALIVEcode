import { ButtonProps } from './buttonTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { classNames } from '../../../Types/utils';

/**
 * Styled button with different premade variants
 *
 * @param {string} variant primary secondary or danger variant
 * @param {React.ReactNode} children react children
 * @param {string} type button type: button, submit or reset
 * @param {() => void} onClick callback called when the button is clicked
 * @param {FontAwesomeIcon} icon FontAwesomeIcon to d
 * @param {string} to url to redirect on click
 * @param {string} padding css padding
 * @param {string} className css classes applied to the button
 *
 * @author MoSk3
 */
const Button: React.FC<
	ButtonProps &
		React.DetailedHTMLProps<
			React.ButtonHTMLAttributes<HTMLButtonElement>,
			HTMLButtonElement
		>
> = ({ variant, onClick, to, children, className, icon, ...props }) => {
	const navigate = useNavigate();

	const customOnClick = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		onClick ? onClick(e) : to && navigate(to);
	};

	const defaultInputOptions = {
		className: classNames(
			'py-2 px-3 rounded-md text-white transition-colors hover:bg-[color:var(--contrast-color)]',
			variant === 'primary' && 'bg-[color:var(--primary-color)]',
			variant === 'secondary' && 'bg-[color:var(--secondary-color)]',
			variant === 'third' && 'bg-[color:var(--third-color)]',
			variant === 'danger' && 'bg-red-600',
			className,
		),
		variant,
		onClick: customOnClick,
	};

	if (icon) {
		return (
			<button {...defaultInputOptions} {...props}>
				<>
					{children}
					<FontAwesomeIcon className="ml-2" icon={icon}></FontAwesomeIcon>
				</>
			</button>
		);
	}

	return (
		<button {...defaultInputOptions} {...props}>
			{children}
		</button>
	);
};

export default Button;
