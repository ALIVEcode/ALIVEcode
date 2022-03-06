import { LevelAliveProps, StyledAliveLevel } from './levelAliveTypes';
import { useEffect, useContext, useMemo } from 'react';
import LineInterface from '../../../Components/LevelComponents/LineInterface/LineInterface';
import { UserContext } from '../../../state/contexts/UserContext';
import Simulation from '../../../Components/LevelComponents/Simulation/Simulation';
import Cmd from '../../../Components/LevelComponents/Cmd/Cmd';
import LevelAliveExecutor from './LevelAliveExecutor';
import useCmd from '../../../state/hooks/useCmd';
import { LevelAlive as LevelAliveModel } from '../../../Models/Level/levelAlive.entity';
import { useAlert } from 'react-alert';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { LevelContext } from '../../../state/contexts/LevelContext';
import LevelToolsBar from '../../../Components/LevelComponents/LevelToolsBar/LevelToolsBar';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';

/**
 * Alive level page. Contains all the components to display and make the alive level functionnal.
 *
 * @param {LevelAliveModel} level alive level object
 * @param {boolean} editMode if the level is in editMode or not
 * @param {LevelProgression} progression the level progression of the current user
 * @param {string} initialCode the initial code of the level
 * @param {(level: LevelAliveModel) => void} setLevel callback used to modify the level in the parent state
 * @param {(progression: LevelProgression) => void} setProgression callback used to modify the level progression in the parent state
 *
 * @author Ecoral360
 * @author Enric Soldevila
 */
const LevelAlive = ({ initialCode }: LevelAliveProps) => {
	const { user, playSocket } = useContext(UserContext);
	const {
		level: levelUntyped,
		executor: executorUntyped,
		editMode,
		progression,
		setProgression,
		saveLevelTimed,
		saveProgressionTimed,
		setShowConfetti,
		askForUserInput,
	} = useContext(LevelContext);
	const level = levelUntyped as LevelAliveModel;
	const executor =
		executorUntyped as React.MutableRefObject<LevelAliveExecutor | null>;

	const forceUpdate = useForceUpdate();
	const [cmdRef, cmd] = useCmd();
	const alert = useAlert();

	executor.current = useMemo(
		() =>
			(executor.current = new LevelAliveExecutor(
				level.name,
				editMode,
				playSocket,
				askForUserInput,
			)),
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
		<StyledAliveLevel>
			<div className="h-full flex flex-row">
				{/* Left Side of screen */}
				<div className="w-1/2 h-full flex flex-col">
					{/* Barre d'infos du niveau */}
					<LevelToolsBar />
					{/* Interface de code */}
					{editMode ? (
						/* Interface du code avec les tabs */
						<LineInterface
							key="edit-mode"
							className="flex-1"
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
						/* Interface de code sans les tabs */
						<LineInterface
							key="play-mode"
							initialContent={initialCode}
							handleChange={lineInterfaceContentChanges}
						/>
					)}
				</div>
				{/* Right Side of screen 
							  Contains the graph and the console
						*/}
				<div className="flex flex-col w-1/2">
					<div className="h-3/5 w-full" id="simulation-row">
						{executor && level.layout && (
							<Simulation
								id={level.id}
								init={s => {
									executor.current?.init(s);
									//setSketch(s);
									executor.current?.loadLevelLayout(level?.layout ?? '[]');
									executor.current?.stop();
								}}
								onChange={(s: any) => {
									const newLayout = executor.current?.saveLayout(s);
									if (!newLayout) {
										alert.error(
											'Une erreur est survenue lors de la sauvegarde du niveau',
										);
										return;
									}
									level!.layout = newLayout;
									saveLevelTimed();
								}}
								stopExecution={() => executor.current?.stop()}
								setShowConfetti={set => setShowConfetti(set)}
							/>
						)}
					</div>
					<div className="h-2/5 flex-1">
						<Cmd ref={cmdRef} />
					</div>
				</div>
			</div>
		</StyledAliveLevel>
	);
};

export default LevelAlive;
