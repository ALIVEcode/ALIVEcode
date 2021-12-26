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
import { Row, Container } from 'react-bootstrap';
import api from '../../../../Models/api';
import { StyledIoTProjectBody } from './iotProjectBodyTypes';
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
import IconButton from '../../../DashboardComponents/IconButton/IconButton';
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

	const getComponentsMatrix = (): Array<Array<IoTComponent>> => {
		const nbColumns = 2;
		const componentsMatrix = [];
		for (let i = 0; i < Math.ceil(components.length / nbColumns); i++) {
			const row = components.slice(i * nbColumns, i * nbColumns + nbColumns);
			componentsMatrix.push(row);
		}
		return componentsMatrix;
	};

	if (!socket || !project) return <LoadingScreen />;
	return (
		<StyledIoTProjectBody noTopRow={noTopRow}>
			<Container fluid>
				<Row className="w-100 mb-3" style={{ justifyContent: 'center' }}>
					{canEdit && (
						<Button
							variant="secondary"
							onClick={() => setOpenComponentCreator(!openComponentCreator)}
						>
							Add a component
						</Button>
					)}
					<IconButton
						onClick={() => {
							navigator.clipboard.writeText(updateId);
							alert.success('Copied');
						}}
						icon={faClipboard}
					>
						Copy Project Id
					</IconButton>
				</Row>
				{getComponentsMatrix().map((row, idx) => (
					<Row className="w-100" key={idx}>
						{row.map((c, idx2) => (
							<IoTGenericComponent
								key={idx2}
								setEditingComponent={setEditingComponent}
								component={c}
							/>
						))}
					</Row>
				))}
			</Container>
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
		</StyledIoTProjectBody>
	);
};

export default IoTProjectBody;