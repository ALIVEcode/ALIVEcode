import { IconButtonProps } from './iconButtonTypes';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const StyledButton = styled.button`
	background-color: var(--primary-color);
	border: none;
	border-radius: 5px;
	color: white;
	padding: 5px 5px;
	transition: 0.2s;
	width: 40px;
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;

	${({ loading }: { loading: string }) => {
		if (loading === 'true')
			return `
		@-webkit-keyframes rotating /* Safari and Chrome */ {
		from {
			-webkit-transform: rotate(0deg);
			-o-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		to {
			-webkit-transform: rotate(360deg);
			-o-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
	@keyframes rotating {
		from {
			-ms-transform: rotate(0deg);
			-moz-transform: rotate(0deg);
			-webkit-transform: rotate(0deg);
			-o-transform: rotate(0deg);
			transform: rotate(0deg);
		}
		to {
			-ms-transform: rotate(360deg);
			-moz-transform: rotate(360deg);
			-webkit-transform: rotate(360deg);
			-o-transform: rotate(360deg);
			transform: rotate(360deg);
		}
	}
	.button-fa-icon {
		-webkit-animation: rotating 1s linear infinite;
		-moz-animation: rotating 1s linear infinite;
		-ms-animation: rotating 1s linear infinite;
		-o-animation: rotating 1s linear infinite;
		animation: rotating 1s linear infinite;
	}`;
	}}

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
 * @author Enric Soldevila
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
	(props, ref) => {
		const { onClick, to, loading, ...other } = props;
		const navigate = useNavigate();
		return (
			<StyledButton
				onClick={() => {
					onClick && onClick();
					to && navigate(to);
				}}
				title={other.title}
				className="icon-button"
				loading={loading ? 'true' : 'false'}
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
				<FontAwesomeIcon
					className="button-fa-icon"
					fixedWidth
					{...other}
					icon={loading ? faSpinner : other.icon}
				/>
			</StyledButton>
		);
	},
);

export default IconButton;
