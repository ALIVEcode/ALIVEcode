import { useEffect, useContext, useMemo } from 'react';
import LineInterface from '../../../Components/ChallengeComponents/LineInterface/LineInterface';
import { UserContext } from '../../../state/contexts/UserContext';
import Cmd from '../../../Components/ChallengeComponents/Cmd/Cmd';
import useCmd from '../../../state/hooks/useCmd';
import { ChallengeCode as ChallengeCodeModel } from '../../../Models/Challenge/challenges/challenge_code.entity';
import { ChallengeCodeProps, StyledCodeChallenge } from './challengeCodeTypes';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { ChallengeContext } from '../../../state/contexts/ChallengeContext';
import ChallengeToolsBar from '../../../Components/ChallengeComponents/ChallengeToolsBar/ChallengeToolsBar';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import ChallengeCodeExecutor from './ChallengeCodeExecutor';

/**
 * Code challenge page. Contains all the components to display and make the code challenge functionnal.
 *
 * @param {ChallengeCodeModel} challenge code challenge object
 * @param {boolean} editMode if the challenge is in editMode or not
 * @param {ChallengeProgression} progression the challenge progression of the current user
 * @param {string} initialCode the initial code of the challenge
 * @param {(challenge: ChallengeCodeModel) => void} setChallenge callback used to modify the challenge in the parent state
 * @param {(progression: ChallengeProgression) => void} setProgression callback used to modify the challenge progression in the parent state
 *
 * @author Enric Soldevila
 */
const ChallengeCode = ({ initialCode }: ChallengeCodeProps) => {
	const { user } = useContext(UserContext);
	const {
		challenge: challengeUntyped,
		executor: executorUntyped,
		editMode,
		progression,
		setProgression,
		saveChallengeTimed,
		saveProgressionTimed,
		askForUserInput,
	} = useContext(ChallengeContext);
	const challenge = challengeUntyped as ChallengeCodeModel;
	const executor =
		executorUntyped as React.MutableRefObject<ChallengeCodeExecutor | null>;

	const forceUpdate = useForceUpdate();
	const [cmdRef, cmd] = useCmd();

	executor.current = useMemo(
		() =>
			(executor.current = new ChallengeCodeExecutor(
				challenge.name,
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
		<>
			<StyledCodeChallenge>
				<div className="h-full flex flex-row">
					{/* Left Side of screen */}
					<div className="w-1/2 h-full flex flex-col">
						<ChallengeToolsBar />
						{editMode ? (
							<LineInterface
								key="edit-mode"
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
			</StyledCodeChallenge>
		</>
	);
};

export default ChallengeCode;
