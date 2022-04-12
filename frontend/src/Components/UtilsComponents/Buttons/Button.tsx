import { ButtonProps } from './buttonTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import React, { forwardRef } from 'react';
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
 * @author Enric Soldevila
 */
const Button = forwardRef<
	HTMLButtonElement,
	ButtonProps &
		React.DetailedHTMLProps<
			React.ButtonHTMLAttributes<HTMLButtonElement>,
			HTMLButtonElement
		>
>(({ variant, onClick, to, children, className, icon, ...props }, ref) => {
	const navigate = useNavigate();

	const customOnClick = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		onClick ? onClick(e) : to && navigate(to);
	};

	const defaultInputOptions = {
		className: classNames(
			'py-2 px-3 rounded-md text-white text-base font-medium transition-colors hover:bg-[color:var(--contrast-color)]',
			variant === 'primary' && 'bg-[color:var(--primary-color)]',
			variant === 'secondary' && 'bg-[color:var(--secondary-color)]',
			variant === 'third' && 'bg-[color:var(--third-color)]',
			variant === 'danger' && 'bg-[color:var(--danger-color)]',
			className,
		),
		variant,
		onClick: customOnClick,
	};

	if (icon) {
		return (
			<button ref={ref} {...defaultInputOptions} {...props}>
				<>
					{children}
					<FontAwesomeIcon className="ml-2" icon={icon} />
				</>
			</button>
		);
	}

	return (
		<button ref={ref} {...defaultInputOptions} {...props}>
			{children}
		</button>
	);
});

export default Button;

/*

UPGRADED BUTTON ?
								<button
									type="button"
									className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
									onClick={() => setOpen(false)}
									ref={cancelButtonRef}
								>
									Cancel
								</button>
*/
