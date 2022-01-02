import { IoTProjectTabs, StyledIoTProject } from './iotProjectPageTypes';
import { useState, useContext } from 'react';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
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
		<StyledIoTProject className="w-full h-full flex flex-col md:flex-row">
			<div className="block order-1 phone:order-2" id="project-details">
				<div className="project-name">{project.name}</div>
				<div className="flex flex-row project-details-body">
					<div className="flex flex-col project-details-tabs">
						<div
							className={
								'flex align-middle justify-center project-details-tab ' +
								(selectedTab === 'settings' && 'project-details-tab-selected')
							}
							onClick={() => setSelectedTab('settings')}
						>
							<div className="text-center">
								<FontAwesomeIcon
									className="project-details-tab-logo"
									icon={faCog}
								/>
								<div>Settings</div>
							</div>
						</div>
						<div
							className={
								'flex align-middle justify-center project-details-tab ' +
								(selectedTab === 'routes' && 'project-details-tab-selected')
							}
							onClick={() => setSelectedTab('routes')}
						>
							<div className="text-center">
								<FontAwesomeIcon
									className="project-details-tab-logo"
									icon={faPlug}
								/>
								<div>Routes</div>
							</div>
						</div>
						<div
							className={
								'flex align-middle justify-center project-details-tab ' +
								(selectedTab === 'access' && 'project-details-tab-selected')
							}
							onClick={() => setSelectedTab('access')}
						>
							<div className="text-center">
								<FontAwesomeIcon
									className="project-details-tab-logo"
									icon={faRoute}
								/>
								<div>Access</div>
							</div>
						</div>
					</div>
					<div className="flex-grow md:w-[16rem] project-details-content">
						{getTabContent()}
					</div>
				</div>
			</div>
			<div
				className="flex-grow flex flex-col h-full order-2 phone:order-1"
				id="project-body"
			>
				<div className="hidden sm:block project-top-row"></div>
				<IoTProjectBody />
			</div>
		</StyledIoTProject>
	);
};

export default IoTProjectPage;