import { CardContainerProps, StyledCardContainer } from './cardContainerTypes';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import { Container, Row } from 'react-bootstrap';
import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';
import { useContext } from 'react';
import { ThemeContext } from '../../../state/contexts/ThemeContext';

/**
 * Container used to display cards components in a grid
 *
 * @param title title in the header of the component
 * @param titleSize css size of the title (optional)
 * @param icon icon displayed after the title (optional)
 * @param height minimumHeight that takes the component (optional)
 * @param asRow adds a row that wraps around the children (optional)
 * @param scrollX css scrollX property (optional)
 * @param scrollY css scrollY property (optional)
 * @param onIconClick function that triggers onClick of icon (optional)
 * @param style tsx style property (optional)
 * @param className (optional)
 * @param children
 * @returns tsx element
 *
 * @author Enric
 */
const CardContainer = ({
	children,
	className,
	title,
	titleSize,
	icon,
	scrollX,
	scrollY,
	onIconClick,
	style,
	height,
	asRow,
}: CardContainerProps) => {
	const { theme } = useContext(ThemeContext);

	return (
		<StyledCardContainer
			height={height}
			style={style}
			scrollX={scrollX}
			scrollY={scrollY}
			titleSize={titleSize}
			className={className}
			theme={theme}
		>
			<div className="card-container-title">
				{title} {icon && <IconButton icon={icon} onClick={onIconClick} />}
			</div>
			<Container fluid className="card-container-body">
				<CenteredContainer
					className="card-container-body-centered"
					vertically
					horizontally
				>
					{asRow ? (
						<Row className="card-container-row">{children}</Row>
					) : (
						<>{children}</>
					)}
				</CenteredContainer>
			</Container>
		</StyledCardContainer>
	);
};

export default CardContainer;