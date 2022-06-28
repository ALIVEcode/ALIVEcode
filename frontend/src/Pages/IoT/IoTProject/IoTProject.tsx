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
	IoTProjectDocument,
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
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import { useParams } from 'react-router';
import IoTProjectPage from '../IoTProjectPage/IoTProjectPage';
import IoTChallenge from '../../Challenge/ChallengeIoT/ChallengeIoT';
import { AsScript as AsScriptModel } from '../../../Models/AsScript/as-script.entity';
import { useNavigate } from 'react-router-dom';
import {
	IoTSocket,
	IoTActionDoneRequestToWatcher,
} from '../../../Models/Iot/IoTProjectClasses/IoTSocket';
import { instanceToPlain } from 'class-transformer';
import { IoTObject } from '../../../Models/Iot/IoTobject.entity';
import Modal from '../../../Components/UtilsComponents/Modal/Modal';
import AsScript from '../../../Components/AliveScriptComponents/AsScript/AsScript';
import IoTObjectLogs from '../../../Components/IoTComponents/IoTObject/IoTObjectLogs/IoTObjectLogs';
import { IoTProjectObject } from '../../../Models/Iot/IoTprojectObject.entity';
import AliotASExecutor from '../../Challenge/ChallengeIoT/AliotASExecutor';

/**
 * IoTProject. On this page are all the components essential in the functionning of an IoTProject.
 * Such as the routes, the settings, creation/update forms, the body with all the IoTComponents etc.
 *
 * @param {string} id id of the project (as url prop)
 *
 * @author Enric Soldevila
 */
const IoTProject = ({ challenge, initialCode, updateId }: IoTProjectProps) => {
	const projectRef = useRef<ProjectModel | null>(challenge?.project ?? null);
	const project = projectRef.current;

	const navigate = useNavigate();
	const alert = useAlert();
	const { t } = useTranslation();
	const { user } = useContext(UserContext);
	const { id: paramId } = useParams<{ id: string | undefined }>();
	const objectsRunning = useRef<IoTProjectObject[]>([]);
	const forceUpdate = useForceUpdate();

	const id = challenge?.id ?? paramId;

	const isChallenge = challenge ? true : false;
	const canEdit = user?.id === projectRef.current?.creator?.id && !isChallenge;

	const saveTimeout = useRef<any>(null);
	const [lastSaved, setLastSaved] = useState<number>(Date.now() - 4000);

	const [scriptOpen, setScriptOpen] = useState<AsScriptModel>();
	const [logsOpened, setLogsOpened] = useState<IoTObject>();

	const saveComponents = useCallback(async () => {
		if (!canEdit || !project) return;
		setLastSaved(Date.now());
		const plainProject = instanceToPlain(project);
		await api.db.iot.projects.updateLayout(project.id, plainProject.layout);
	}, [project, canEdit]);

	const saveComponentsTimed = useCallback(async () => {
		if (!canEdit) return;
		if (Date.now() - lastSaved < 1000) {
			saveTimeout.current && clearTimeout(saveTimeout.current);
			saveTimeout.current = setTimeout(saveComponents, 1000);
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

	const handleOnReceiveListen = (fields: { [key: string]: any }) => {
		objectsRunning.current.forEach(o => {
			if (o.hasExecutor()) {
				const executor = o.executor as AliotASExecutor;
				executor.running && executor.docFieldChanged(fields);
			}
		});
	};

	const handleOnReceiveActionDone = (data: IoTActionDoneRequestToWatcher) => {
		objectsRunning.current.forEach(o => {
			if (o.hasExecutor()) {
				const executor = o.executor as AliotASExecutor;
				executor.running && executor.receiveActionDone(data);
			}
		});
	};

	const socket = useMemo(() => {
		if (!project || !user) return;

		return new IoTSocket(
			project.id,
			user.id,
			project,
			project.name,
			onRequestRender,
			handleOnReceiveListen,
			handleOnReceiveActionDone,
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [project]);

	useEffect(() => {
		if (!socket) return;
		socket.setOnRender(onRequestRender);
	}, [socket, onRequestRender]);

	useEffect(() => {
		if (!id || challenge?.project) return;
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

	useEffect(() => {
		return () => {
			socket?.closeSocket();
		};
	}, [socket]);

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
		(iotObject: IoTProjectObject) => {
			if (!canEdit || !project) return;
			project.iotProjectObjects?.push(iotObject);
			alert.success(t('iot.project.add_object.success'));
		},
		[alert, canEdit, project, t],
	);

	const loadIoTObjects = useCallback(async () => {
		if (!project) return;
		await project.getIoTObjects();
		forceUpdate();
	}, [project, forceUpdate]);

	const loadIoTScripts = useCallback(async () => {
		if (!project) return;
		await project.getIoTScripts();
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
		(route: IotRoute, asScript: AsScriptModel) => {
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

	const connectObjectToProject = useCallback(
		async (object: IoTObject) => {
			if (!project) return;
			await api.db.iot.objects.connectObjectToProject(object, project);
			object.currentIotProject = project;
			object.currentIoTProjectId = project.id;
			forceUpdate();
		},
		[project, forceUpdate],
	);

	const disconnectObjectFromProject = useCallback(
		async (object: IoTObject) => {
			if (!project) return;
			await api.db.iot.objects.disconnectObjectFromProject(object, project);
			object.currentIoTProjectId = undefined;
			object.currentIotProject = undefined;
			forceUpdate();
		},
		[project, forceUpdate],
	);

	const createScript = useCallback(
		async (script: AsScriptModel) => {
			if (!project) return;
			const newScript = await api.db.iot.projects.createScript(project, script);
			project.scripts.push(newScript);
			forceUpdate();
		},
		[forceUpdate, project],
	);

	const setScriptOfObject = useCallback(
		async (projectObject: IoTProjectObject, script: AsScriptModel) => {
			if (!project) return;
			await api.db.iot.projects.setScriptOfObject(
				project,
				projectObject,
				script,
			);
			projectObject.script = script;
			projectObject.scriptId = script.id;
			forceUpdate();
		},
		[forceUpdate, project],
	);

	const addRunningObject = useCallback(
		(obj: IoTProjectObject) => {
			if (objectsRunning.current.includes(obj)) return;
			objectsRunning.current.push(obj);
			forceUpdate();
		},
		[forceUpdate],
	);

	const removeRunningObject = useCallback(
		(obj: IoTProjectObject) => {
			objectsRunning.current = objectsRunning.current.filter(
				o => o.id !== obj.id,
			);
			forceUpdate();
		},
		[forceUpdate],
	);

	const providerValues: IoTProjectContextValues = useMemo(() => {
		return {
			project: project ?? null,
			canEdit,
			updateId: updateId ? updateId : project ? project.id : '',
			isChallenge,
			socket: socket ?? null,
			objectsRunning: objectsRunning.current,
			addRunningObject,
			removeRunningObject,
			addRoute,
			deleteRoute,
			updateRoute,
			addIoTObject,
			loadIoTObjects,
			loadIoTScripts,
			updateProjectData,
			updateScript,
			updateDocument,
			connectObjectToProject,
			disconnectObjectFromProject,
			createScript,
			setScriptOpen,
			setLogsOpen: setLogsOpened,
			setScriptOfObject,
		};
	}, [
		project,
		canEdit,
		updateId,
		isChallenge,
		socket,
		addRunningObject,
		removeRunningObject,
		addRoute,
		deleteRoute,
		updateRoute,
		addIoTObject,
		loadIoTObjects,
		loadIoTScripts,
		updateProjectData,
		updateScript,
		updateDocument,
		connectObjectToProject,
		disconnectObjectFromProject,
		createScript,
		setScriptOfObject,
	]);

	if (!project) {
		return <LoadingScreen />;
	}

	return (
		<IoTProjectContext.Provider value={providerValues}>
			{challenge ? (
				<IoTChallenge initialCode={initialCode ?? ''} />
			) : (
				<IoTProjectPage />
			)}
			<Modal
				title="Script"
				open={scriptOpen !== undefined}
				setOpen={state => !state && setScriptOpen(undefined)}
				size="lg"
			>
				{scriptOpen && (
					<AsScript
						onSave={(asScript: AsScriptModel) => {}}
						asScript={scriptOpen}
					/>
				)}
			</Modal>
			<Modal
				title={t('iot.object.logs', { name: logsOpened?.name })}
				open={logsOpened !== undefined}
				setOpen={state => !state && setLogsOpened(undefined)}
				size="lg"
			>
				{logsOpened && <IoTObjectLogs object={logsOpened} />}
			</Modal>
		</IoTProjectContext.Provider>
	);
};

export default IoTProject;
