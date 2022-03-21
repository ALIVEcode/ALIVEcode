import { ChallengeAliveProps } from './challengeAliveTypes';
import { useEffect, useContext, useMemo } from 'react';
import LineInterface from '../../../Components/ChallengeComponents/LineInterface/LineInterface';
import { UserContext } from '../../../state/contexts/UserContext';
import Simulation from '../../../Components/ChallengeComponents/Simulation/Simulation';
import Cmd from '../../../Components/ChallengeComponents/Cmd/Cmd';
import ChallengeAliveExecutor from './ChallengeAliveExecutor';
import useCmd from '../../../state/hooks/useCmd';
import { ChallengeAlive as ChallengeAliveModel } from '../../../Models/Challenge/challenges/challenge_alive.entity';
import { useAlert } from 'react-alert';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { ChallengeContext } from '../../../state/contexts/ChallengeContext';
import ChallengeToolsBar from '../../../Components/ChallengeComponents/ChallengeToolsBar/ChallengeToolsBar';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';

/**
 * Alive challenge page. Contains all the components to display and make the alive challenge functionnal.
 *
 * @param {ChallengeAliveModel} challenge alive challenge object
 * @param {boolean} editMode if the challenge is in editMode or not
 * @param {ChallengeProgression} progression the challenge progression of the current user
 * @param {string} initialCode the initial code of the challenge
 * @param {(challenge: ChallengeAliveModel) => void} setChallenge callback used to modify the challenge in the parent state
 * @param {(progression: ChallengeProgression) => void} setProgression callback used to modify the challenge progression in the parent state
 *
 * @author Ecoral360
 * @author Enric Soldevila
 */
const ChallengeAlive = ({ initialCode }: ChallengeAliveProps) => {
	const { user, playSocket } = useContext(UserContext);
	const {
		challenge: challengeUntyped,
		executor: executorUntyped,
		editMode,
		progression,
		setProgression,
		saveChallengeTimed,
		saveProgressionTimed,
		setShowConfetti,
		askForUserInput,
	} = useContext(ChallengeContext);
	const challenge = challengeUntyped as ChallengeAliveModel;
	const executor =
		executorUntyped as React.MutableRefObject<ChallengeAliveExecutor | null>;

	const forceUpdate = useForceUpdate();
	const [cmdRef, cmd] = useCmd();
	const alert = useAlert();

	executor.current = useMemo(
		() =>
			(executor.current = new ChallengeAliveExecutor(
				challenge.name,
				editMode,
				playSocket,
				askForUserInput,
			)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[challenge?.id, user],
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

	if (!challenge) return <LoadingScreen></LoadingScreen>;

	return (
		<div className="w-full h-full">
			<div className="h-full flex flex-row">
				{/* Left Side of screen */}
				<div className="w-1/2 h-full flex flex-col">
					{/* Barre d'infos du niveau */}
					<ChallengeToolsBar />
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
									defaultContent: challenge.initialCode,
									onChange: content => {
										challenge.initialCode = content;
										saveChallengeTimed();
									},
								},
								{
									title: 'Solution',
									open: false,
									defaultContent: challenge.solution,
									onChange: content => {
										challenge.solution = content;
										saveChallengeTimed();
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
						{executor && challenge.layout && (
							<Simulation
								id={challenge.id}
								init={s => {
									executor.current?.init(s);
									//setSketch(s);
									executor.current?.loadChallengeLayout(
										challenge?.layout ?? '[]',
									);
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
									challenge!.layout = newLayout;
									saveChallengeTimed();
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
		</div>
	);
};

export default ChallengeAlive;
