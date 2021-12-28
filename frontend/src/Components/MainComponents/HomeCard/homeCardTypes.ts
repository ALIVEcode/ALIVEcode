import styled from 'styled-components';
import { Card } from 'react-bootstrap';

export type HomeCardProps = {
	title: string;
	content: string;
	img: string;
	onClick?: () => void;
	to?: string;
};

export const StyledHomeCard = styled(Card)`
	text-align: left;
	border-radius: 25px;
	background-color: var(--background-color) !important;
	box-shadow: 0px 0px 15px 1px rgb(170, 170, 170);
	margin-bottom: 70px !important;
	-webkit-transition: all 0.2s ease;
	-moz-transition: all 0.2s ease;
	-o-transition: all 0.2s ease;
	transition: all 0.2s ease;
	cursor: pointer;

	&:nth-child(even):hover {
		transform: rotate(-2deg) scale(1.03) !important;
		box-shadow: 0px 0px 15px 1px var(--primary-color);
	}

	&:nth-child(odd):hover {
		transform: rotate(2deg) scale(1.03) !important;
		box-shadow: 0px 15px 35px var(--primary-color);
	}

	& p {
		font-size: 20px;
	}

	& .card-img {
		max-height: 300px;
	}
`;