
import { useContext, useEffect, useMemo } from 'react';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { Col, Row } from 'react-bootstrap';
import IoTProjectBody from '../../../Components/IoTComponents/IoTProject/IoTProjectBody/IotProjectBody';
import { IoTProjectContext } from '../../../state/contexts/IoTProjectContext';
import { StyledIoTLevel } from './levelIoTTypes';
import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import useCmd from '../../../state/hooks/useCmd';
import { LevelContext } from '../../../state/contexts/LevelContext';
import { UserContext } from '../../../state/contexts/UserContext';
import { LevelIoT as LevelIoTModel } from '../../../Models/Level/levelIoT.entity';
import LevelToolsBar from '../../../Components/LevelComponents/LevelToolsBar/LevelToolsBar';
import LineInterface from '../../../Components/LevelComponents/LineInterface/LineInterface';
import Cmd from '../../../Components/LevelComponents/Cmd/Cmd';
import LevelIoTExecutor from './LevelIoTExecutor';

/**
 * IoTProject. On this page are all the components essential in the functionning of an IoTProject.
 * Such as the routes, the settings, creation/update forms, the body with all the IoTComponents etc.
 *
 * @param {string} id id of the project (as url prop)
 *
 * @author MoSk3
 */
const IoTLevel = ({ initialCode }: { initialCode: string }) => {
	const { project } = useContext(IoTProjectContext);
	const { user } = useContext(UserContext);
	const {
		level: levelUntyped,
		executor: executorUntyped,
		progression,
		editMode,
		setProgression,
		saveProgressionTimed,
		askForUserInput,
		saveLevelTimed,
	} = useContext(LevelContext);

	const level = levelUntyped as LevelIoTModel;
	const executor =
		executorUntyped as React.MutableRefObject<LevelIoTExecutor | null>;

	const forceUpdate = useForceUpdate();
	const [cmdRef, cmd] = useCmd();

	executor.current = useMemo(
		() =>
			(executor.current = new LevelIoTExecutor(level.name, askForUserInput)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[level?.id, user],
	);

	const lineInterfaceContentChanges = (content: any) => {
		console.log(executor.current);
		if (executor.current) executor.current.lineInterfaceContent = content;
		if (!editMode && progression) {
			progression.data.code = content;
			const updatedProgression = progression;
			setProgression(updatedProgression);
			saveProgressionTimed();
		}
	};

	useEffect(() => {
		if (!cmd) return forceUpdate();
		if (executor.current) executor.current.cmd = cmd;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cmd]);

	if (!level || !project) return <LoadingScreen></LoadingScreen>;

	return (
		<StyledIoTLevel>
			<FillContainer className="project-container" relative>
				<Row className="h-100">
					<Col className="left-col" md={6}>
						<LevelToolsBar />
						{editMode ? (
							<LineInterface
								hasTabs
								tabs={[
									{
										title: 'Initial Code',
										open: true,
										defaultContent: level.initialCode,
										onChange: content => {
											level.initialCode = content;
											saveLevelTimed();
										},
									},
									{
										title: 'Solution',
										open: false,
										defaultContent: level.solution,
										onChange: content => {
											level.solution = content;
											saveLevelTimed();
										},
									},
								]}
								handleChange={lineInterfaceContentChanges}
							/>
						) : (
							<LineInterface
								initialContent={initialCode}
								handleChange={lineInterfaceContentChanges}
							/>
						)}
					</Col>
					<Col sm="6" className="right-col">
						<Row style={{ height: '60vh' }}>
							<IoTProjectBody noTopRow />
						</Row>
						<Row style={{ height: '40vh' }}>
							<Cmd ref={cmdRef}></Cmd>
						</Row>
					</Col>
				</Row>
			</FillContainer>
		</StyledIoTLevel>
	);
};

export default IoTLevel;