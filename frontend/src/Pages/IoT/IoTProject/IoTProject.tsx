import { IoTProjectProps } from './iotProjectTypes';
import {
	useEffect,
	useContext,
	useMemo,
	useCallback,
	useRef,
	useState,
} from 'react';
import {
	IoTProject as ProjectModel,
	IoTProjectLayout,
	IOTPROJECT_ACCESS,
	IOTPROJECT_INTERACT_RIGHTS,
} from '../../../Models/Iot/IoTproject.entity';
import api from '../../../Models/api';
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
import IoTLevel from '../../Level/LevelIoT/LevelIoT';
import { AsScript } from '../../../Models/AsScript/as-script.entity';
import { useNavigate } from 'react-router-dom';
import { IoTProjectDocument } from '../../../../../backend/src/models/iot/IoTproject/entities/IoTproject.entity';
import { IoTSocket } from '../../../Models/Iot/IoTProjectClasses/IoTSocket';
import { instanceToPlain } from 'class-transformer';
import { IoTComponent } from '../../../Models/Iot/IoTProjectClasses/IoTComponent';

/**
 * IoTProject. On this page are all the components essential in the functionning of an IoTProject.
 * Such as the routes, the settings, creation/update forms, the body with all the IoTComponents etc.
 *
 * @param {string} id id of the project (as url prop)
 *
 * @author MoSk3
 */
const IoTProject = ({ level, initialCode, updateId }: IoTProjectProps) => {
	const projectRef = useRef<ProjectModel | null>(level?.project ?? null);
	const project = projectRef.current;

	const navigate = useNavigate();
	const alert = useAlert();
	const { t } = useTranslation();
	const { user } = useContext(UserContext);
	const { id: paramId } = useParams<{ id: string | undefined }>();
	const forceUpdate = useForceUpdate();

	const id = level?.id ?? paramId;

	const isLevel = level ? true : false;
	const canEdit = user?.id === projectRef.current?.creator?.id && !isLevel;

	const saveTimeout = useRef<any>(null);
	const [lastSaved, setLastSaved] = useState<number>(Date.now() - 4000);

	const saveComponents = useCallback(async () => {
		if (!canEdit || !project) return;
		setLastSaved(Date.now());
		const plainProject = instanceToPlain(project);
		await api.db.iot.projects.updateLayout(project.id, plainProject.layout);
	}, [project, canEdit]);

	const saveComponentsTimed = useCallback(async () => {
		if (!canEdit) return;
		if (Date.now() - lastSaved < 2000) {
			saveTimeout.current && clearTimeout(saveTimeout.current);
			saveTimeout.current = setTimeout(saveComponents, 2000);
			return;
		}

		saveComponents();
	}, [lastSaved, saveComponents, canEdit]);

	const onRequestRender = useCallback(
		(saveLayout: boolean) => {
			forceUpdate();
			saveLayout && saveComponentsTimed();
		},
		[forceUpdate, saveComponentsTimed],
	);

	const socket = useMemo(() => {
		if (!project) return;

		return new IoTSocket(project.id, project, project.name, onRequestRender);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [project]);

	useEffect(() => {
		if (!socket) return;
		socket.setOnRender(onRequestRender);
	}, [socket, onRequestRender]);

	useEffect(() => {
		if (!id || level?.project) return;
		const getProject = async () => {
			try {
				const project: ProjectModel = await api.db.iot.projects.get({
					id,
				});
				await project.getRoutes();
				projectRef.current = project;
				forceUpdate();
			} catch (err) {
				navigate('/');
				return alert.error(t('error.not_found', { obj: t('msg.course') }));
			}
		};
		getProject();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, user]);

	const addRoute = useCallback(
		(route: IotRoute) => {
			if (!canEdit || !project) return;
			project.routes.push(route);
			forceUpdate();
		},
		[canEdit, forceUpdate, project],
	);

	const deleteRoute = useCallback(
		async (route: IotRoute) => {
			if (!project) return;
			await api.db.iot.projects.deleteRoute({
				id: route.id,
				projectId: project?.id,
			});
			project.routes = project?.routes.filter(r => r.id !== route.id);
			forceUpdate();
		},
		[forceUpdate, project],
	);

	const addIoTObject = useCallback(
		(iotObject: IoTObject) => {
			if (!canEdit || !project) return;
			project.iotObjects?.push(iotObject);
			alert.success(t('iot.project.add_object.success'));
		},
		[alert, canEdit, project, t],
	);

	const loadIoTObjects = useCallback(async () => {
		if (!project) return;
		await project.getIoTObjects();
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
			forceUpdate();
		},
		[project, forceUpdate],
	);

	const updateRoute = useCallback(
		(route: IotRoute) => {
			if (!project) return;
			project.routes = project?.routes.map(r =>
				r.id === route.id ? route : r,
			);
			forceUpdate();
		},
		[forceUpdate, project],
	);

	const updateScript = useCallback(
		(route: IotRoute, asScript: AsScript) => {
			const routeFound = project?.routes.find(r => r.id === route.id);
			if (routeFound) {
				routeFound.asScript = asScript;
				forceUpdate();
			}
		},
		[forceUpdate, project?.routes],
	);

	const updateDocument = useCallback(
		async (doc: IoTProjectDocument) => {
			if (!project) return;
			project.document = (
				await api.db.iot.projects.updateDocument(project.id, doc)
			).document;
			forceUpdate();
		},
		[forceUpdate, project],
	);

	const providerValues: IoTProjectContextValues = useMemo(() => {
		return {
			project: project ?? null,
			canEdit,
			updateId: updateId ? updateId : project ? project.id : '',
			isLevel,
			socket: socket ?? null,
			addRoute,
			deleteRoute,
			updateRoute,
			addIoTObject,
			loadIoTObjects,
			updateProjectData,
			updateScript,
			updateDocument,
		};
	}, [
		project,
		canEdit,
		updateId,
		isLevel,
		socket,
		addRoute,
		deleteRoute,
		updateRoute,
		addIoTObject,
		loadIoTObjects,
		updateProjectData,
		updateScript,
		updateDocument,
	]);

	if (!project) {
		return <LoadingScreen />;
	}

	return (
		<IoTProjectContext.Provider value={providerValues}>
			{level ? (
				<IoTLevel initialCode={initialCode ?? ''} />
			) : (
				<IoTProjectPage />
			)}
		</IoTProjectContext.Provider>
	);
};

export default IoTProject;
