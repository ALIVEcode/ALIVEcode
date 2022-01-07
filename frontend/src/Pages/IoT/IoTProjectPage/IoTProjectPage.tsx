import { IoTProjectTabs, StyledIoTProject } from './iotProjectPageTypes';
import { useState, useContext } from 'react';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faRoute,
	faCog,
	faPlug,
	faChevronUp,
	faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import IoTProjectBody from '../../../Components/IoTComponents/IoTProject/IoTProjectBody/IotProjectBody';
import IoTProjectAccess from '../../../Components/IoTComponents/IoTProject/IoTProjectAccess/IoTProjectAccess';
import IoTProjectRoutes from '../../../Components/IoTComponents/IoTProject/IoTProjectRoutes/IoTProjectRoutes';
import IoTProjectSettings from '../../../Components/IoTComponents/IoTProject/IoTProjectSettings/IoTProjectSettings';
import { IoTProjectContext } from '../../../state/contexts/IoTProjectContext';
import { Disclosure } from '@headlessui/react';

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(' ');
}

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
		<Disclosure
			as={StyledIoTProject}
			className="w-full h-full flex flex-col tablet:flex-row"
		>
			{({ open }) => (
				<>
					<div
						className={classNames(
							open ? 'h-3/5' : 'h-auto',
							'block order-3 tablet:order-1 tablet:h-auto',
						)}
						id="project-details"
					>
						<div className="project-name border-b border-t border-[color:var(--bg-shade-four-color)] tablet:border-t-0 flex flex-row justify-between items-center">
							<div>{project.name}</div>
							<Disclosure.Button
								as={FontAwesomeIcon}
								icon={open ? faChevronDown : faChevronUp}
								className="cursor-pointer tablet:hidden"
							></Disclosure.Button>
						</div>

						<div
							className={classNames(
								open ? 'flex' : 'hidden',
								'tablet:flex flex-row project-details-body',
							)}
						>
							<div className="flex flex-col project-details-tabs">
								<div
									className={
										'flex align-middle justify-center project-details-tab ' +
										(selectedTab === 'settings' &&
											'project-details-tab-selected')
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
							<div className="flex-grow tablet:w-[16rem] overflow-y-auto project-details-content">
								{getTabContent()}
							</div>
						</div>
					</div>
					<div
						className="flex-grow flex flex-col h-2/5 tablet:h-full order-2"
						id="project-body"
					>
						<IoTProjectBody />
					</div>
				</>
			)}
		</Disclosure>
	);
};

export default IoTProjectPage;
