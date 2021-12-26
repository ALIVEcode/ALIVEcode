import { IoTProjectTabs, StyledIoTProject } from './iotProjectPageTypes';
import { useState, useContext } from 'react';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRoute, faCog, faPlug } from '@fortawesome/free-solid-svg-icons';
import IoTProjectBody from '../../../Components/IoTComponents/IoTProject/IoTProjectBody/IotProjectBody';
import IoTProjectAccess from '../../../Components/IoTComponents/IoTProject/IoTProjectAccess/IoTProjectAccess';
import IoTProjectRoutes from '../../../Components/IoTComponents/IoTProject/IoTProjectRoutes/IoTProjectRoutes';
import IoTProjectSettings from '../../../Components/IoTComponents/IoTProject/IoTProjectSettings/IoTProjectSettings';
import { IoTProjectContext } from '../../../state/contexts/IoTProjectContext';

/**
 * IoTProject. On this page are all the components essential in the functionning of an IoTProject.
 * Such as the routes, the settings, creation/update forms, the body with all the IoTComponents etc.
 *
 * @param {string} id id of the project (as url prop)
 *
 * @author MoSk3
 */
const IoTProjectPage = () => {
	const { project } = useContext(IoTProjectContext);
	const [selectedTab, setSelectedTab] = useState<IoTProjectTabs>('settings');

	if (!project) {
		return <LoadingScreen />;
	}

	const getTabContent = () => {
		switch (selectedTab) {
			case 'settings':
				return <IoTProjectSettings />;
			case 'routes':
				return <IoTProjectRoutes />;
			case 'access':
				return <IoTProjectAccess />;
		}
	};

	return (
		<StyledIoTProject>
			<Row className="h-100">
				<Col sm="4" id="project-details">
					<Row className="project-name">{project.name}</Row>
					<Row className="project-details-body">
						<Col className="project-details-tabs">
							<Row
								className={
									'project-details-tab ' +
									(selectedTab === 'settings' && 'project-details-tab-selected')
								}
								onClick={() => setSelectedTab('settings')}
							>
								<FontAwesomeIcon
									className="project-details-tab-logo"
									icon={faCog}
								/>
								Settings
							</Row>
							<Row
								className={
									'project-details-tab ' +
									(selectedTab === 'routes' && 'project-details-tab-selected')
								}
								onClick={() => setSelectedTab('routes')}
							>
								<FontAwesomeIcon
									className="project-details-tab-logo"
									icon={faPlug}
								/>
								Routes
							</Row>
							<Row
								className={
									'project-details-tab ' +
									(selectedTab === 'access' && 'project-details-tab-selected')
								}
								onClick={() => setSelectedTab('access')}
							>
								<FontAwesomeIcon
									className="project-details-tab-logo"
									icon={faRoute}
								/>
								Access
							</Row>
						</Col>
						<Col className="project-details-content">{getTabContent()}</Col>
					</Row>
				</Col>
				<Col sm="8" id="project-body">
					<Row className="project-top-row"></Row>
					<IoTProjectBody />
				</Col>
			</Row>
		</StyledIoTProject>
	);
};

export default IoTProjectPage;