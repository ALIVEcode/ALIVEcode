import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { MoreOptionsButtonProps } from './MoreOptionButtonProps';
import { faEllipsisH, faTrash } from '@fortawesome/free-solid-svg-icons';

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
 * @author Ecoral360
 */
const MoreOptionsButton = React.forwardRef<
	HTMLButtonElement,
	MoreOptionsButtonProps
>((props, ref) => {
	const { onClick, hideBackground, ...other } = props;

	return (
		<StyledButton
			onClick={() => {
				onClick && onClick();
			}}
			className="icon-button"
			ref={ref}
		>
			{props.children && (
				<p style={{ margin: '2px', marginRight: '5px', cursor: 'pointer' }}>
					{props.children}
				</p>
			)}
			<FontAwesomeIcon icon={faTrash} fixedWidth {...other} />
		</StyledButton>
	);
});

export default MoreOptionsButton;
