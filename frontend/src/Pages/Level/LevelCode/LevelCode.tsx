import { useEffect, useContext, useMemo } from 'react';
import LineInterface from '../../../Components/LevelComponents/LineInterface/LineInterface';
import { UserContext } from '../../../state/contexts/UserContext';
import Cmd from '../../../Components/LevelComponents/Cmd/Cmd';
import useCmd from '../../../state/hooks/useCmd';
import { LevelCode as LevelCodeModel } from '../../../Models/Level/levelCode.entity';
import { LevelCodeProps, StyledCodeLevel } from './levelCodeTypes';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { LevelContext } from '../../../state/contexts/LevelContext';
import LevelToolsBar from '../../../Components/LevelComponents/LevelToolsBar/LevelToolsBar';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import LevelCodeExecutor from './LevelCodeExecutor';

/**
 * Code level page. Contains all the components to display and make the code level functionnal.
 *
 * @param {LevelCodeModel} level code level object
 * @param {boolean} editMode if the level is in editMode or not
 * @param {LevelProgression} progression the level progression of the current user
 * @param {string} initialCode the initial code of the level
 * @param {(level: LevelCodeModel) => void} setLevel callback used to modify the level in the parent state
 * @param {(progression: LevelProgression) => void} setProgression callback used to modify the level progression in the parent state
 *
 * @author Enric Soldevila
 */
const LevelCode = ({ initialCode }: LevelCodeProps) => {
	const { user } = useContext(UserContext);
	const {
		level: levelUntyped,
		executor: executorUntyped,
		editMode,
		progression,
		setProgression,
		saveLevelTimed,
		saveProgressionTimed,
		askForUserInput,
	} = useContext(LevelContext);
	const level = levelUntyped as LevelCodeModel;
	const executor =
		executorUntyped as React.MutableRefObject<LevelCodeExecutor | null>;

	const forceUpdate = useForceUpdate();
	const [cmdRef, cmd] = useCmd();

	executor.current = useMemo(
		() =>
			(executor.current = new LevelCodeExecutor(level.name, askForUserInput)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[level?.id, user],
	);

	const lineInterfaceContentChanges = (content: any) => {
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

	if (!level) return <LoadingScreen></LoadingScreen>;

	return (
		<>
			<StyledCodeLevel>
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
					<div className=" h-full w-1/2">
						<Cmd ref={cmdRef}></Cmd>
					</div>
				</div>
			</StyledCodeLevel>
		</>
	);
};

export default LevelCode;
