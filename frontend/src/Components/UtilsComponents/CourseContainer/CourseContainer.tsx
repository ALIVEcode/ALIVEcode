import { CourseContainerProps } from './courseContainerTypes';
import { Col, Container, Row } from 'react-bootstrap';
import CourseCard from '../../CourseComponents/CourseCard/CourseCard';

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
const CourseContainer = ({ courses }: CourseContainerProps) => {
	return (
		<Container fluid className="h-100 mt-4 justify-content-start">
			<Row>
				{courses.map((c, idx) => (
					<Col key={idx} className="mb-5" xs={12} sm={6} md={4} lg={3} xl={2}>
						<CourseCard course={c}></CourseCard>
					</Col>
				))}
			</Row>
		</Container>
	);
};

export default CourseContainer;