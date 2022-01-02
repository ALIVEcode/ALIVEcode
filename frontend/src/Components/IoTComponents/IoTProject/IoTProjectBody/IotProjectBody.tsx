import { IoTProjectLayout } from '../../../../Models/Iot/IoTproject.entity';
import {
	useState,
	useEffect,
	useMemo,
	useCallback,
	useRef,
	useContext,
} from 'react';
import { IoTSocket } from '../../../../Models/Iot/IoTProjectClasses/IoTSocket';
import { classToPlain, plainToClass } from 'class-transformer';
import { IoTComponent } from '../../../../Models/Iot/IoTProjectClasses/IoTComponent';
import api from '../../../../Models/api';
import IoTGenericComponent from '../../IoTProjectComponents/IoTGenericComponent/IoTGenericComponent';
import Modal from '../../../UtilsComponents/Modal/Modal';
import IoTComponentEditor from '../IoTComponentEditor/IoTComponentEditor';
import Button from '../../../UtilsComponents/Button/Button';
import IoTComponentCreator from '../IoTComponentCreator/IoTComponentCreator';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import LoadingScreen from '../../../UtilsComponents/LoadingScreen/LoadingScreen';
import { LevelContext } from '../../../../state/contexts/LevelContext';
import { LevelIoTProgressionData } from '../../../../Models/Level/levelProgression';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';

const IoTProjectBody = ({ noTopRow }: { noTopRow?: boolean }) => {
	const [components, setComponents] = useState<Array<IoTComponent>>([]);
	const [lastSaved, setLastSaved] = useState<number>(Date.now() - 4000);
	const [editingComponent, setEditingComponent] = useState<IoTComponent>();
	const [openComponentCreator, setOpenComponentCreator] = useState(false);
	const saveTimeout = useRef<any>(null);
	const alert = useAlert();
	const { t } = useTranslation();
	const { project, canEdit, updateId, isLevel } = useContext(IoTProjectContext);
	const { progression } = useContext(LevelContext);

	const saveComponents = useCallback(
		async (components: Array<IoTComponent>) => {
			if (!canEdit || !project) return;
			setLastSaved(Date.now());
			project.layout.components = components;
			const plainProject = classToPlain(project);
			await api.db.iot.projects.updateLayout(project.id, plainProject.layout);
		},
		[project, canEdit],
	);

	const saveComponentsTimed = useCallback(
		async (components: Array<IoTComponent>) => {
			if (!canEdit) return;
			if (Date.now() - lastSaved < 2000) {
				saveTimeout.current && clearTimeout(saveTimeout.current);
				saveTimeout.current = setTimeout(
					() => saveComponents(components),
					2000,
				);
				return;
			}

			saveComponents(components);
		},
		[lastSaved, saveComponents, canEdit],
	);

	const onLayoutChange = useCallback(
		(layout: IoTProjectLayout) => {
			setComponents([...layout.components]);
			saveComponentsTimed(layout.components);
		},
		[saveComponentsTimed],
	);

	const socket = useMemo(
		() => {
			if (!project) return;
			const layout = isLevel
				? plainToClass(
						IoTProjectLayout,
						(progression?.data as LevelIoTProgressionData).layout,
				  )
				: project.layout;

			return new IoTSocket(updateId, layout, project.name, onLayoutChange);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	useEffect(() => {
		if (!socket) return;
		socket.setOnRender(onLayoutChange);
	}, [socket, onLayoutChange]);

	if (!socket || !project) return <LoadingScreen />;
	return (
		<div
			className="flex-1"
			style={{ backgroundColor: 'var(--background-color)' }}
		>
			<div className="flex flex-col h-full items-center">
				<div className="p-5">
					{canEdit && (
						<Button
							variant="secondary"
							onClick={() => setOpenComponentCreator(!openComponentCreator)}
							className="mr-2"
						>
							Add a component
						</Button>
					)}
					<Button
						variant="primary"
						onClick={() => {
							navigator.clipboard.writeText(updateId);
							alert.success('Copied');
						}}
						icon={faClipboard}
					>
						Copy Project Id
					</Button>
				</div>
				<div className="p-2 pt-0 w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
					{components.map((c, idx) => (
						<IoTGenericComponent
							key={idx}
							setEditingComponent={setEditingComponent}
							component={c}
						/>
					))}
				</div>
				<Modal
					size="lg"
					centered
					title="Edit component"
					open={editingComponent ? true : false}
					onClose={() => setEditingComponent(undefined)}
				>
					{editingComponent && (
						<IoTComponentEditor
							onClose={() => setEditingComponent(undefined)}
							component={editingComponent}
						></IoTComponentEditor>
					)}
				</Modal>
				<Modal
					size="xl"
					title="Add a component"
					centered
					open={openComponentCreator}
					onClose={() => setOpenComponentCreator(false)}
				>
					<IoTComponentCreator
						onSelect={(c: IoTComponent) => {
							const componentManager = socket.getComponentManager();
							if (!componentManager) return;
							setOpenComponentCreator(false);
							c = componentManager.addComponent(c);
							alert.success(t('iot.project.add_component.success'));
							setEditingComponent(c);
						}}
					/>
				</Modal>
			</div>
		</div>
	);
};

export default IoTProjectBody;