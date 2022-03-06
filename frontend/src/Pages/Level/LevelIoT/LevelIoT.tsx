import { useContext, useEffect, useMemo } from 'react';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import IoTProjectInterface from '../../../Components/IoTComponents/IoTProject/IoTProjectInterface/IotProjectInterface';
import { IoTProjectContext } from '../../../state/contexts/IoTProjectContext';
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
 * @author Enric Soldevila
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
		<FillContainer>
			<div className="h-full flex flex-row">
				{/* Left Side of screen */}
				<div className="w-1/2 h-full flex flex-col">
					<LevelToolsBar />
					{editMode ? (
						<LineInterface
							key="edit-mode"
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
							key="play-mode"
							initialContent={initialCode}
							handleChange={lineInterfaceContentChanges}
						/>
					)}
				</div>
				<div className="flex flex-col w-1/2">
					<div className="h-2/3 w-full">
						<IoTProjectInterface noTopRow />
					</div>
					<div className="h-1/3">
						<Cmd ref={cmdRef}></Cmd>
					</div>
				</div>
			</div>
		</FillContainer>
	);
};

export default IoTLevel;
