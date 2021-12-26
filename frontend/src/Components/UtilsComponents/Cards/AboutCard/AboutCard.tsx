import { AboutCardProps } from './aboutCardTypes';
import styled from 'styled-components';
import { Col } from 'react-bootstrap';

const StyledDiv = styled(Col)`
	background-color: var(--background-color);
	color: var(--foreground-color);
	border-radius: 25px;
	box-shadow: 0px 0px 2px rgb(130 130 130);
	padding: 15px;
	margin-bottom: 25px;
	margin-left: 7px;
	margin-right: 7px;

	.about-name {
		margin-top: 10px;
	}

	img {
		border-radius: 20px;
		width: 250px;
		height: 250px;
	}
`;

/**
 * Card that shows an image of a contributor of the platform with its name
 *
 * @param {string} img source of the image
 * @param {string} name of the contributor
 * @param {string} className classNames of the card
 *
 * @author MoSk3
 */
const AboutCard = ({ img, name, className }: AboutCardProps) => {
	return (
		<StyledDiv lg className={className}>
			<img src={img} alt={`alive-${name}`} />
			<div className="about-name">
				<h3>{name}</h3>
			</div>
		</StyledDiv>
	);
};

export default AboutCard;