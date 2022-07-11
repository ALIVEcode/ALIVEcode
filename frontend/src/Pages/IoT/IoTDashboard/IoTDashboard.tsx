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
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import Modal from '../../../Components/UtilsComponents/Modal/Modal';
import IoTObjectLogs from '../../../Components/IoTComponents/IoTObject/IoTObjectLogs/IoTObjectLogs';
import AlertConfirm from '../../../Components/UtilsComponents/Alert/AlertConfirm/AlertConfirm';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import FeaturedCourseContainer from '../../../Components/CourseComponents/FeaturedCourseContainer/FeaturedCourseContainer';
import { SUBJECTS } from '../../../Types/sharedTypes';
import ShowcaseProjectGallery from '../../../Components/MainComponents/ShowcaseProjectGallery/ShowcaseProjectGallery';

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
	const [searchObject, setSearchObject] = useState<string>();
	const [searchProject, setSearchProject] = useState<string>();
	const [openObjectCreate, setOpenObjectCreate] = useState(false);
	const [logsOpened, setLogsOpened] = useState<IoTObject>();
	const [confirmDeletionObject, setConfirmDeletionObject] =
		useState<IoTObject>();
	const [confirmDeletionProject, setConfirmDeletionProject] =
		useState<IoTProject>();
	const [loadingObjects, setLoadingObjects] = useState(false);
	const [loadingProjects, setLoadingProjects] = useState(false);
	const navigate = useNavigate();
	const alert = useAlert();

	const getProjects = async () => {
		setLoadingProjects(true);
		const projects = await api.db.users.iot.getProjects({
			name: searchProject,
		});
		setProjects(projects);
		setLoadingProjects(false);
	};

	const getObjects = async () => {
		setLoadingObjects(true);
		const objects = await api.db.users.iot.getObjects({ name: searchObject });
		setObjects(objects);
		setLoadingObjects(false);
	};

	useEffect(() => {
		const getProjectsAndObjects = async () => {
			if (!user) return;
			getProjects();
			getObjects();
		};
		getProjectsAndObjects();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const handleProjectCreation = () => {
		navigate(routes.auth.create_iot_project.path);
	};

	const handleObjectCreation = () => {
		setOpenObjectCreate(true);
	};

	const handleObjectUpdate = async (object: IoTObject, newName: string) => {
		await api.db.iot.objects.update({ id: object.id }, { name: newName });
		getObjects();
	};

	const handleProjectDeletion = (project: IoTProject) => {
		setConfirmDeletionProject(project);
	};

	const handleProjectDeletionConfirm = async (project: IoTProject) => {
		await api.db.iot.projects.delete({ id: project.id });
		alert.success(t('iot.project.delete_success'));
		getProjects();
	};

	const handleObjectDeletion = (object: IoTObject) => {
		setConfirmDeletionObject(object);
	};

	const handleObjectDeletionConfirm = async (object: IoTObject) => {
		await api.db.iot.objects.delete({ id: object.id });
		alert.success(t('iot.object.delete_success'));
		getObjects();
	};

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
				<div className="w-full mb-8 bg-[color:var(--background-color)] border rounded-lg border-[color:var(--bg-shade-four-color)]">
					<div className="flex items-center flex-col tablet:flex-row tablet:justify-between px-4 py-2 border-b border-[color:var(--bg-shade-four-color)]">
						<div className="flex items-center">
							{t('dashboard.iot.projects')}{' '}
							<Info.Icon
								hoverPopup={{
									position: 'right center',
								}}
								className="inline"
							>
								<Info.Box useDefaultStyle text={t('help.iot.project')} />
							</Info.Icon>
						</div>
						<div className="flex flex-col tablet:flex-row items-center tracking-wide gap-2 tablet:gap-4">
							<Link onClick={handleProjectCreation}>
								{t('dashboard.iot.create_project')}
							</Link>
							<SearchBar
								value={searchProject ?? ''}
								setValue={setSearchProject}
								onSubmit={getProjects}
							/>
						</div>
					</div>
					<div className="h-48 overflow-y-auto">
						{loadingProjects ? (
							<LoadingScreen relative></LoadingScreen>
						) : projects && projects.length > 0 ? (
							projects.map((p, idx) => (
								<IoTProjectCard
									handleProjectDeletion={handleProjectDeletion}
									key={idx}
									project={p}
								/>
							))
						) : (
							<div className="flex h-full justify-center items-center px-4 py-2 text-[color:var(--fg-shade-four-color)] text-center">
								<div>
									<label className="block tablet:inline">
										{t('dashboard.iot.no_project')}.{' '}
									</label>
									<Link onClick={handleProjectCreation}>
										{t('dashboard.iot.create_project')}
									</Link>
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="w-full overflow-y-auto mb-8 bg-[color:var(--background-color)] border rounded-lg border-[color:var(--bg-shade-four-color)]">
					<div className="flex items-center flex-col tablet:flex-row tablet:justify-between px-4 py-2 border-b border-[color:var(--bg-shade-four-color)]">
						<div className="flex items-center">
							{t('dashboard.iot.objects')}
							<Info.Icon
								hoverPopup={{
									position: 'right center',
								}}
								className="inline"
							>
								<Info.Box useDefaultStyle text={t('help.iot.object')} />
							</Info.Icon>
						</div>
						<div className="flex flex-col tablet:flex-row items-center tracking-wide gap-2 tablet:gap-4">
							<Link onClick={handleObjectCreation}>
								{t('dashboard.iot.create_object')}
							</Link>
							<SearchBar
								value={searchObject ?? ''}
								setValue={setSearchObject}
								onSubmit={getObjects}
							/>
						</div>
					</div>
					<div className="h-48 overflow-y-auto">
						{loadingObjects ? (
							<LoadingScreen relative></LoadingScreen>
						) : objects && objects.length > 0 ? (
							objects.map((o, idx) => (
								<IoTObjectCard
									handleObjectDeletion={handleObjectDeletion}
									handleObjectUpdate={handleObjectUpdate}
									handleLogsOpening={setLogsOpened}
									key={idx}
									object={o}
								/>
							))
						) : (
							<div className="flex h-full justify-center items-center px-4 py-2 text-[color:var(--fg-shade-four-color)] text-center">
								<div>
									<label className="block tablet:inline">
										{t('dashboard.iot.no_object')}.{' '}
									</label>
									<Link onClick={handleObjectCreation}>
										{t('dashboard.iot.create_object')}
									</Link>
								</div>
							</div>
						)}
					</div>
				</div>
				<FeaturedCourseContainer
					className="my-4"
					title={t('home.iot.section.learn.by_alivecode')}
					featuring={SUBJECTS.IOT}
					featuringFrom="alivecode"
				/>
				<div className="text-lg mt-6">
					{t('dashboard.iot.showcase_projects')}
				</div>
				<div className="border-b w-1/3 border-[color:var(--bg-shade-four-color)]" />
				<ShowcaseProjectGallery
					className="mt-4"
					nbItems={6}
					subject={SUBJECTS.IOT}
				/>
				<div className="">&nbsp;</div>
			</div>
			<FormModal
				onSubmit={res => {
					getObjects();
					setOpenObjectCreate(false);
				}}
				setOpen={setOpenObjectCreate}
				title={t('form.title.create_iot_project')}
				open={openObjectCreate}
			>
				<IoTObjectCreate />
			</FormModal>
			<Modal
				title={t('iot.object.logs', { name: logsOpened?.name })}
				open={logsOpened !== undefined}
				setOpen={state => !state && setLogsOpened(undefined)}
				size="lg"
			>
				{logsOpened && <IoTObjectLogs object={logsOpened} />}
			</Modal>
			<AlertConfirm
				secureConfirmation={{
					type: 'text',
					title: t('iot.object.delete_test'),
					comparisonValue: confirmDeletionObject?.name,
					placeholder: confirmDeletionObject?.name,
				}}
				title={t('iot.object.delete')}
				open={confirmDeletionObject !== undefined}
				setOpen={_ => setConfirmDeletionObject(undefined)}
				onConfirm={() =>
					confirmDeletionObject &&
					handleObjectDeletionConfirm(confirmDeletionObject)
				}
			/>
			<AlertConfirm
				secureConfirmation={{
					type: 'text',
					title: t('iot.project.delete_test'),
					comparisonValue: confirmDeletionProject?.name,
					placeholder: confirmDeletionProject?.name,
				}}
				title={t('iot.project.delete')}
				open={confirmDeletionProject !== undefined}
				setOpen={_ => setConfirmDeletionProject(undefined)}
				onConfirm={() =>
					confirmDeletionProject &&
					handleProjectDeletionConfirm(confirmDeletionProject)
				}
			/>
		</div>
	);
};

export default IoTDashboard;
