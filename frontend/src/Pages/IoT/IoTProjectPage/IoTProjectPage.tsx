import { IoTProjectTabs, StyledIoTProject } from './iotProjectPageTypes';
import { useState, useContext, useEffect } from 'react';
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
		<StyledIoTProject tw="w-full h-full flex flex-col md:flex-row">
			<div tw="block order-2 md:order-1" id="project-details">
				<div className="project-name">{project.name}</div>
				<div tw="flex flex-row" className="project-details-body">
					<div tw="flex flex-col" className="project-details-tabs">
						<div
							tw="flex align-middle justify-center"
							className={
								'project-details-tab ' +
								(selectedTab === 'settings' && 'project-details-tab-selected')
							}
							onClick={() => setSelectedTab('settings')}
						>
							<div tw="text-center">
								<FontAwesomeIcon
									className="project-details-tab-logo"
									icon={faCog}
								/>
								<div>Settings</div>
							</div>
						</div>
						<div
							tw="flex align-middle justify-center"
							className={
								'project-details-tab ' +
								(selectedTab === 'routes' && 'project-details-tab-selected')
							}
							onClick={() => setSelectedTab('routes')}
						>
							<div tw="text-center">
								<FontAwesomeIcon
									className="project-details-tab-logo"
									icon={faPlug}
								/>
								<div>Routes</div>
							</div>
						</div>
						<div
							tw="flex align-middle justify-center"
							className={
								'project-details-tab ' +
								(selectedTab === 'access' && 'project-details-tab-selected')
							}
							onClick={() => setSelectedTab('access')}
						>
							<div tw="text-center">
								<FontAwesomeIcon
									className="project-details-tab-logo"
									icon={faRoute}
								/>
								<div>Access</div>
							</div>
						</div>
					</div>
					<div tw="flex-grow md:w-[16rem]" className="project-details-content">
						{getTabContent()}
					</div>
				</div>
			</div>
			<div
				tw="flex-grow flex flex-col h-full order-1 md:order-2"
				id="project-body"
			>
				<div tw="hidden sm:block" className="project-top-row"></div>
				<IoTProjectBody />
			</div>
		</StyledIoTProject>
	);
};

export default IoTProjectPage;