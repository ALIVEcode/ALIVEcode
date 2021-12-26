import { HomeCardProps, StyledHomeCard } from './homeCardTypes';
import { Card, Row, Col } from 'react-bootstrap';
import { useContext } from 'react';
import { ThemeContext } from '../../../state/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

/**
 * Cards in the home page that shows the different part of the site.
 *
 * @param {string} title title of the card
 * @param {content} content body content of the card
 * @param {string} to redirect to url on click
 * @param {string} img source of the image
 * @param {() => void} onClick callback when the card is clicked
 *
 * @author MoSk3
 */
const HomeCard = ({ title, content, to, img, onClick }: HomeCardProps) => {
	const navigate = useNavigate();
	const { theme } = useContext(ThemeContext);

	return (
		<StyledHomeCard
			onClick={() => {
				onClick ? onClick() : to && navigate(to);
			}}
		>
			<Row className="g-0">
				<Col md={4}>
					<img src={img} className="card-img" alt="..."></img>
				</Col>
				<Col md={8}>
					<div style={{ padding: '25px', color: theme.color.foreground }}>
						<Card.Title as="h4">{title}</Card.Title>
						<Card.Text as="p">{content}</Card.Text>
					</div>
				</Col>
			</Row>
		</StyledHomeCard>
	);
};

export default HomeCard;