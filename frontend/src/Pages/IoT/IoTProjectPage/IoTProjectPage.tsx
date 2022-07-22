import {
	IoTProjectOptions,
	IoTProjectTabs,
	StyledIoTProject,
	IoTProjectTab,
} from './iotProjectPageTypes';
import { useState, useContext } from 'react';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCog,
	faPlug,
	faChevronUp,
	faChevronDown,
	faWindowMinimize,
	faWindowMaximize,
} from '@fortawesome/free-solid-svg-icons';
import IoTProjectInterface from '../../../Components/IoTComponents/IoTProject/IoTProjectInterface/IotProjectInterface';
import IoTProjectObjects from '../../../Components/IoTComponents/IoTProject/IoTProjectObjects/IoTProjectObjects';
import IoTProjectRoutes from '../../../Components/IoTComponents/IoTProject/IoTProjectRoutes/IoTProjectRoutes';
import IoTProjectSettings from '../../../Components/IoTComponents/IoTProject/IoTProjectSettings/IoTProjectSettings';
import { IoTProjectContext } from '../../../state/contexts/IoTProjectContext';
import { Disclosure } from '@headlessui/react';
import { classNames } from '../../../Types/utils';
import IoTProjectDocuments from '../../../Components/IoTComponents/IoTProject/IoTProjectDocuments/IoTProjectDocuments';
import { useTranslation } from 'react-i18next';
import IoTProjectScripts from '../../../Components/IoTComponents/IoTProject/IoTProjectScripts/IoTProjectScripts';
import Link from '../../../Components/UtilsComponents/Link/Link';
import useRoutes from '../../../state/hooks/useRoutes';

/**
 * IoTProject. On this page are all the components essential in the functionning of an IoTProject.
 * Such as the routes, the settings, creation/update forms, the body with all the IoTComponents etc.
 *
 * @param {string} id id of the project (as url prop)
 *
 * @author Enric Soldevila
 */
const IoTProjectPage = ({ className }: { className?: string }) => {
	const { project, objectsRunning } = useContext(IoTProjectContext);
	const { t } = useTranslation();
	const { routes } = useRoutes();
	const [selectedOption, setSelectedOption] =
		useState<IoTProjectOptions>('settings');
	const [selectedTab, setSelectedTab] = useState<IoTProjectTabs>('interface');

	const tabs: IoTProjectTab[] = [
		{
			name: t('iot.project.interface.name'),
			type: 'interface',
		},
		{
			name: t('iot.project.document.name'),
			type: 'documents',
		},
		{
			name: t('iot.project.objects.name'),
			type: 'objects',
		},
		{
			name: t('iot.project.scripts.name'),
			type: 'scripts',
		},
	];

	if (!project) {
		return <LoadingScreen />;
	}

	const renderOptionContent = () => {
		switch (selectedOption) {
			case 'settings':
				return <IoTProjectSettings />;
			case 'routes':
				return <IoTProjectRoutes />;
		}
	};

	const renderTabContent = () => {
		switch (selectedTab) {
			case 'interface':
				return <IoTProjectInterface />;
			case 'documents':
				return <IoTProjectDocuments />;
			case 'objects':
				return <IoTProjectObjects />;
			case 'scripts':
				return <IoTProjectScripts />;
		}
	};

	const isPhoneView = () => {
		return window.innerWidth <= 480;
	};

	return (
		<Disclosure
			as={StyledIoTProject}
			className={classNames(
				'w-full h-full flex flex-col tablet:flex-row',
				className,
			)}
			defaultOpen={!isPhoneView()}
		>
			{({ open }: { open: boolean }) => (
				<>
					{!isPhoneView() && !open ? (
						<div className="border-r border-[color:var(--bg-shade-four-color)] p-2">
							<Disclosure.Button
								as={FontAwesomeIcon}
								icon={open ? faWindowMinimize : faWindowMaximize}
								size="2x"
								title={t('course.navigation.maximize')}
								className="cursor-pointer hidden tablet:block"
							/>
						</div>
					) : (
						<div
							className={classNames(
								open ? 'h-3/5' : 'h-auto',
								'block order-3 tablet:order-1 tablet:h-auto',
							)}
							id="project-details"
						>
							<div className="text-xl p-2 h-[50px] border-b border-t border-[color:var(--bg-shade-four-color)] tablet:border-t-0 flex flex-row justify-between items-center">
								<div>
									<div>{project.name}</div>
									{project.originalId && (
										<div className="text-xs">
											{t('iot.project.cloned_from')}:{' '}
											<Link
												onClick={e => e.stopPropagation()}
												to={routes.auth.iot_project.path.replace(
													':id',
													project.originalId,
												)}
												openInNewTab
											>
												{project.originalId}
											</Link>
										</div>
									)}
								</div>
								<Disclosure.Button
									as={FontAwesomeIcon}
									icon={open ? faChevronDown : faChevronUp}
									className="cursor-pointer tablet:hidden"
									title={
										open
											? t('course.navigation.minimize')
											: t('course.navigation.maximize')
									}
								/>
								<Disclosure.Button
									as={FontAwesomeIcon}
									icon={open ? faWindowMinimize : faWindowMaximize}
									className="cursor-pointer hidden tablet:block"
									title={
										open
											? t('course.navigation.minimize')
											: t('course.navigation.maximize')
									}
								/>
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
											(selectedOption === 'settings' &&
												'project-details-tab-selected')
										}
										onClick={() => setSelectedOption('settings')}
									>
										<div className="text-center">
											<FontAwesomeIcon
												className="project-details-tab-logo"
												icon={faCog}
											/>
											<div>{t('iot.project.settings')}</div>
										</div>
									</div>
									<div
										className={
											'flex align-middle justify-center project-details-tab ' +
											(selectedOption === 'routes' &&
												'project-details-tab-selected')
										}
										onClick={() => setSelectedOption('routes')}
									>
										<div className="text-center">
											<FontAwesomeIcon
												className="project-details-tab-logo"
												icon={faPlug}
											/>
											<div>{t('iot.project.routes')}</div>
										</div>
									</div>
								</div>
								<div className="flex-grow tablet:w-[16rem] overflow-y-auto project-details-content">
									{renderOptionContent()}
								</div>
							</div>
						</div>
					)}

					<div
						className="flex-grow flex flex-col h-2/5 tablet:h-full order-2"
						id="project-body"
					>
						<div className="flex flex-row border-b p-1 text-xs tablet:text-base">
							<h2 className="mr-2">
								{t('iot.project.scripts.running_scripts')}:{' '}
							</h2>
							{objectsRunning.length === 0 ? (
								<label className="italic">
									{t('iot.project.scripts.no_running_scripts')}
								</label>
							) : (
								objectsRunning.map((object, idx) => (
									<label key={idx} className="px-3 border-x rounded-sm">
										{object.target?.name}
									</label>
								))
							)}
						</div>
						<div className="text-sm tablet:text-base laptop:text-lg overflow-x-auto h-[50px] border-b border-t border-[color:var(--bg-shade-four-color)] tablet:border-t-0 flex flex-row justify-evenly text-center">
							{tabs.map((t, idx) => (
								<div
									key={idx}
									onClick={() => setSelectedTab(t.type)}
									className={classNames(
										'w-full cursor-pointer p-2 flex items-center justify-center',
										t.type === selectedTab
											? 'bg-[color:var(--bg-shade-two-color)]'
											: 'hover:bg-[color:var(--bg-shade-one-color)]',
									)}
								>
									<div>{t.name}</div>
								</div>
							))}
						</div>
						{renderTabContent()}
					</div>
				</>
			)}
		</Disclosure>
	);
};

export default IoTProjectPage;
