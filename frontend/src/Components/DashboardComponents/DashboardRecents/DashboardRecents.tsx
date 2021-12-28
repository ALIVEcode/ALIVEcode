import { Col, Container, Row } from 'react-bootstrap';
import { StyledDashboardRecent } from './dashboardRecentTypes';
import { useContext } from 'react';
import { DashboardContext } from '../../../state/contexts/DashboardContext';
import CourseContainer from '../../UtilsComponents/CourseContainer/CourseContainer';

export const DashboardRecents = () => {
	const { getCourses } = useContext(DashboardContext);

	return (
		<StyledDashboardRecent className="h-100">
			<Container fluid className="container-1">
				<Row className="h-100 no-gutters">
					<Col className="h-100 section-recents">
						<div className="section-title">Formations Récentes</div>
						<div className="underline"></div>
						<CourseContainer courses={getCourses()}></CourseContainer>
					</Col>
				</Row>
			</Container>
			<Container fluid className="container-2">
				<Row className="h-100 no-gutters">
					<Col className="h-100 section-levels">
						<div className="section-title">Mes niveaux</div>
						<div className="underline"></div>
					</Col>
					<Col className="h-100 section-notifs">
						<div className="section-title">Notifications</div>
						<div className="underline"></div>
					</Col>
				</Row>
			</Container>
		</StyledDashboardRecent>
	);
};

export default DashboardRecents;