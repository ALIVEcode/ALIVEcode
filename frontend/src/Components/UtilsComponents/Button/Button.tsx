import { ButtonProps, StyledButton } from './buttonTypes';
import { useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
const Button = ({
	variant,
	type,
	onClick,
	to,
	children,
	padding,
	className,
	disabled,
	icon,
}: ButtonProps) => {
	const history = useHistory();

	const customOnClick = () => {
		onClick ? onClick() : to && history.push(to);
	};

	const defaultInputOptions = {
		className: 'btn ' + className,
		padding,
		variant,
		type,
		disabled,
		onClick: customOnClick,
	};

	if (icon) {
		return (
			<StyledButton {...defaultInputOptions}>
				<>
					{children}
					<FontAwesomeIcon className="ml-2" icon={icon}></FontAwesomeIcon>
				</>
			</StyledButton>
		);
	}

	return <StyledButton {...defaultInputOptions}>{children}</StyledButton>;
};

export default Button;