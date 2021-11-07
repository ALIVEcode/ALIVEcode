import { IoTProjectProps } from './iotProjectTypes';
import { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import {
	IoTProject as ProjectModel,
	IOTPROJECT_ACCESS,
	IOTPROJECT_INTERACT_RIGHTS,
} from '../../../Models/Iot/IoTproject.entity';
import api from '../../../Models/api';
import { useHistory } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../state/contexts/UserContext';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import {
	IoTProjectContext,
	IoTProjectContextValues,
} from '../../../state/contexts/IoTProjectContext';
import { IotRoute } from '../../../Models/Iot/IoTroute.entity';
import { IoTObject } from '../../../Models/Iot/IoTobject.entity';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import { useParams } from 'react-router';
import IoTProjectPage from '../IoTProjectPage/IoTProjectPage';
import IoTProjectComponent from '../IoTProjectComponent/IoTProjectComponent';

/**
 * IoTProject. On this page are all the components essential in the functionning of an IoTProject.
 * Such as the routes, the settings, creation/update forms, the body with all the IoTComponents etc.
 *
 * @param {string} id id of the project (as url prop)
 *
 * @author MoSk3
 */
const IoTProject = ({ id: idProps }: IoTProjectProps) => {
	const [project, setProject] = useState<ProjectModel>();
	const history = useHistory();
	const alert = useAlert();
	const { t } = useTranslation();
	const { user } = useContext(UserContext);
	const { id: idParam } = useParams<{ id: string | undefined }>();
	const forceUpdate = useForceUpdate();

	const canEdit = user?.id === project?.creator?.id;

	const id = idProps ?? idParam;

	useEffect(() => {
		if (!id) return;
		const getProject = async () => {
			try {
				const project: ProjectModel = await api.db.iot.projects.get({
					id,
				});
				await project.getRoutes();
				setProject(project);
			} catch (err) {
				history.push('/');
				return alert.error(t('error.not_found', { obj: t('msg.course') }));
			}
		};
		getProject();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, user]);

	const addRoute = useCallback(
		(route: IotRoute) => {
			console.log('WAD');
			if (!canEdit || !project) return;
			project.routes.push(route);
			setProject(project);
		},
		[canEdit, project],
	);

	const addIoTObject = useCallback(
		(iotObject: IoTObject) => {
			if (!canEdit || !project) return;
			project.iotObjects?.push(iotObject);
			setProject(project);
			alert.success(t('iot.project.add_object.success'));
		},
		[alert, canEdit, project, t],
	);

	const loadIoTObjects = useCallback(async () => {
		if (!project) return;
		await project.getIoTObjects();
		setProject(project);
		forceUpdate();
	}, [project, forceUpdate]);

	const updateProjectData = useCallback(
		(
			name: string,
			description: string,
			access: IOTPROJECT_ACCESS,
			interactRights: IOTPROJECT_INTERACT_RIGHTS,
		) => {
			if (!project) return;
			project.name = name;
			project.description = description;
			project.access = access;
			project.interactRights = interactRights;
			setProject(project);
			forceUpdate();
		},
		[project, forceUpdate],
	);

	const providerValues: IoTProjectContextValues = useMemo(() => {
		return {
			project: project ?? null,
			canEdit,
			addRoute,
			addIoTObject,
			loadIoTObjects,
			updateProjectData,
		};
	}, [
		project,
		canEdit,
		addRoute,
		addIoTObject,
		loadIoTObjects,
		updateProjectData,
	]);

	if (!project) {
		return <LoadingScreen />;
	}

	return (
		<IoTProjectContext.Provider value={providerValues}>
			{idProps ? <IoTProjectComponent /> : <IoTProjectPage />}
		</IoTProjectContext.Provider>
	);
};

export default IoTProject;