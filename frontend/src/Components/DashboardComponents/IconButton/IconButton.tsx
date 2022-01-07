import { IconButtonProps } from './iconButtonTypes';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StyledButton = styled.button`
	background-color: var(--third-color);
	border: none;
	border-radius: 10px;
	color: white;
	padding: 5px 5px;
	transition: 0.2s;

	&:hover {
		background-color: var(--contrast-color);
	}
`;

/**
 * Styled button with an icon
 *
 * @param {() => void} onClick callback called when the button is pressed
 * @param {string} to url to redirect to on button click
 * @param {HTMLButtonElement} other HTMLButtonElement props
 *
 * @author MoSk3
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
	(props, ref) => {
		const { onClick, to, ...other } = props;
		const navigate = useNavigate();
		return (
			<StyledButton
				onClick={() => {
					onClick && onClick();
					to && navigate(to);
				}}
				className="icon-button"
				ref={ref}
			>
				{props.children && (
					<label
						onClick={() => to && navigate(to)}
						className="m-1 mr-2 cursor-pointer"
					>
						{props.children}
					</label>
				)}
				<FontAwesomeIcon fixedWidth {...other} />
			</StyledButton>
		);
	},
);

export default IconButton;