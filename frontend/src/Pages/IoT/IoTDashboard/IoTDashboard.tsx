import { iotDashboardProps } from './iotDashboardTypes';
import { useContext, useEffect, useState } from 'react';
import api from '../../../Models/api';
import { IoTProject } from '../../../Models/Iot/IoTproject.entity';
import { IoTObject } from '../../../Models/Iot/IoTobject.entity';
import IoTObjectCreate from '../../../Components/IoTComponents/IoTObject/IotObjectForm/IoTObjectCreate';
import FormModal from '../../../Components/UtilsComponents/FormModal/FormModal';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../state/contexts/UserContext';
import Info from '../../../Components/HelpComponents';
import IoTProjectCard from '../../../Components/IoTComponents/IoTProjectCard/IoTProjectCard';
import IoTObjectCard from '../../../Components/IoTComponents/IoTObjectCard/IoTObjectCard';
import SearchBar from '../../../Components/MainComponents/BrowsingMenu/SearchBar/SearchBar';
import Link from '../../../Components/UtilsComponents/Link/Link';
import useRoutes from '../../../state/hooks/useRoutes';
import { plainToInstance } from 'class-transformer';

/**
 * IoT dashboard page that contains all the projects, objects and stuff of the user
 *
 * @author Enric Soldevila
 */
const IoTDashboard = (props: iotDashboardProps) => {
	const { user } = useContext(UserContext);
	const { routes } = useRoutes();
	const [projects, setProjects] = useState<IoTProject[]>();
	const [objects, setObjects] = useState<IoTObject[]>();
	const { t } = useTranslation();
	const [searchObject, setSearchObject] = useState('');
	const [searchProject, setSearchProject] = useState('');
	const [openObjectCreate, setOpenObjectCreate] = useState(false);

	useEffect(() => {
		const getProjects = async () => {
			if (!user) return;
			const projects = await api.db.users.iot.getProjects({});
			const objects = await api.db.users.iot.getObjects({});
			setProjects(projects);
			setObjects(objects);
		};
		getProjects();
	}, [user]);

	return (
		<div className="h-full p-4">
			<div className="section-title flex flex-row justify-between w-1/3">
				{t('dashboard.iot.title')}{' '}
				<Info.Icon
					// onClick={() => setTimelineOpen(true)}
					hoverPopup={{
						position: 'right center',
					}}
				>
					<Info.Box useDefaultStyle text={t('help.dashboard.views.iot')} />
				</Info.Icon>
			</div>
			<div className="border-b w-1/3 border-[color:var(--bg-shade-four-color)]" />
			<div className="w-full h-full py-4">
				<div className="w-full h-1/2 overflow-y-auto mb-8 bg-[color:var(--background-color)] border rounded-lg border-[color:var(--bg-shade-four-color)]">
					<div className="flex items-center justify-between px-4 py-2 border-b border-[color:var(--bg-shade-four-color)]">
						<div>{t('dashboard.iot.projects')}</div>
						<div className="flex flex-row items-center tracking-wide gap-4">
							<Link to={routes.auth.create_iot_project.path}>
								{t('dashboard.iot.create_project')}
							</Link>
							<SearchBar
								value={searchProject}
								setValue={setSearchProject}
								onSubmit={() => {}}
							/>
						</div>
					</div>
					{projects && projects.length > 0 ? (
						projects.map((p, idx) => <IoTProjectCard key={idx} project={p} />)
					) : (
						<div className="px-4 py-2 text-[color:var(--fg-shade-four-color)]">
							{t('dashboard.iot.no_project')}
						</div>
					)}
				</div>
				<div className="w-full h-1/2 overflow-y-auto mb-4 bg-[color:var(--background-color)] border rounded-lg border-[color:var(--bg-shade-four-color)]">
					<div className="flex items-center justify-between px-4 py-2 border-b border-[color:var(--bg-shade-four-color)]">
						<div>{t('dashboard.iot.objects')}</div>
						<div className="flex flex-row items-center tracking-wide gap-4">
							<Link onClick={() => setOpenObjectCreate(true)}>
								{t('dashboard.iot.create_object')}
							</Link>
							<SearchBar
								value={searchObject}
								setValue={setSearchObject}
								onSubmit={() => {}}
							/>
						</div>
					</div>
					<div>
						{objects && objects.length > 0 ? (
							objects.map((o, idx) => <IoTObjectCard key={idx} object={o} />)
						) : (
							<div className="px-4 py-2 text-[color:var(--fg-shade-four-color)]">
								{t('dashboard.iot.no_object')}
							</div>
						)}
					</div>
				</div>
			</div>
			<FormModal
				onSubmit={res => {
					if (!objects) return;
					const newObject: IoTObject = plainToInstance(
						IoTObject,
						res.data,
					) as any as IoTObject;
					setObjects([...objects, newObject]);
					setOpenObjectCreate(false);
				}}
				setOpen={setOpenObjectCreate}
				title={t('form.title.create_iot_project')}
				open={openObjectCreate}
			>
				<IoTObjectCreate />
			</FormModal>
		</div>
	);
};

export default IoTDashboard;
