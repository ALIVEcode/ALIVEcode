import { CardStyles, GenericCardProps } from './genericCardTypes';
import styled from 'styled-components';
import { useHistory } from 'react-router';

/**
 * Generic card that can be styled as pleased
 *
 * @param {string} img source of the image
 * @param {string} title title of the card
 * @param {string} to path to redirect to on card click
 * @param {() => void} onClick callback called when the card is clicked
 * @param {string} className classes name of the card
 *
 * @author MoSk3
 */
const GenericCard = ({
	img,
	to,
	title,
	style,
	className,
	onClick,
}: GenericCardProps) => {
	const history = useHistory();

	return (
		<div
			className={className}
			style={style}
			onClick={() => {
				if (onClick) onClick();
				else if (to) history.push(to);
			}}
		>
			<div className="padded-button">
				<div className="logo-button">
					<div style={{ backgroundImage: `url(${img})` }}></div>
				</div>
				<div className="text-button">
					<div>{title}</div>
				</div>
			</div>
		</div>
	);
};

export default styled(GenericCard)`
	position: relative;
	background-color: var(--primary-color);
	margin: ${(props: CardStyles) => props.margin};
	width: ${(props: CardStyles) => props.width + 'px'};
	height: ${(props: CardStyles) => props.height + 'px'};
	box-shadow: ${(props: CardStyles) => props.boxShadow || 'none'};
	vertical-align: center;
	text-align: center;
	transition: 0.2s;
	cursor: pointer;
	border-radius: 20px;

	&:hover {
		transform: rotate(5deg) scale(${(props: CardStyles) => props.scale || 1});
		background-color: var(--third-color);
		box-shadow: 0px 5px 30px rgb(131, 131, 131);
	}

	.padded-button {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	.logo-button {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 90%;
		height: 60%;
	}

	.logo-button div {
		position: relative;
		width: 70%;
		height: 70%;
		background-size: contain;
		background-repeat: no-repeat;
		background-position-x: center;
		background-position-y: center;
	}

	.text-button {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 90%;
		height: 35%;
	}

	.text-button div {
		position: relative;
		font-size: 220%;
		color: white;
		width: 90%;
		text-align: center;
		vertical-align: middle;
	}
`;