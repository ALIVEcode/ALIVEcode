import React, { useContext, useEffect, useMemo, useState } from 'react';
import LineInterface from '../../../Components/ChallengeComponents/LineInterface/LineInterface';
import { UserContext } from '../../../state/contexts/UserContext';
import Cmd from '../../../Components/ChallengeComponents/Cmd/Cmd';
import useCmd from '../../../state/hooks/useCmd';
import { ChallengeCode as ChallengeCodeModel } from '../../../Models/Challenge/challenges/challenge_code.entity';
import { ChallengeCodeProps } from './challengeCodeTypes';
import LoadingScreen from '../../../Components/UtilsComponents/LoadingScreen/LoadingScreen';
import { ChallengeContext } from '../../../state/contexts/ChallengeContext';
import ChallengeToolsBar from '../../../Components/ChallengeComponents/ChallengeToolsBar/ChallengeToolsBar';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import ChallengeCodeExecutor from './ChallengeCodeExecutor';
import { useAlert } from 'react-alert';

/**
 * Code challenge page. Contains all the components to display and make the code challenge functional.
 *
 * @param {ChallengeCodeModel} challenge code challenge object
 * @param {string} initialCode the initial code of the challenge
 *
 * @author Enric Soldevila, Mathis Laroche
 */
const ChallengeCode = ({ initialCode }: ChallengeCodeProps) => {
	const { user } = useContext(UserContext);
	const {
		challenge: challengeUntyped,
		executor: executorUntyped,
		editMode,
		showTerminal,
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
	const alert = useAlert();
	const [cmdSize, setCmdSize] = useState(2);

	executor.current = useMemo(
		() =>
			(executor.current = new ChallengeCodeExecutor(
				challenge.name,
				askForUserInput,
				alert,
				challenge.lang,
			)),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[challenge?.id, user],
	);

	const lineInterfaceContentChanges = (content: any) => {
		if (executor.current) executor.current.lineInterfaceContent = content;
		if (!editMode && progression) {
			progression.data.code = content;
			setProgression(progression);
			saveProgressionTimed();
		}
	};

	useEffect(() => {
		if (!cmd) return forceUpdate();
		if (executor.current) executor.current.cmd = cmd;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cmd]);

	if (!challenge) return <LoadingScreen />;

	return (
		<div className="relative h-full w-full">
			<div className="h-full flex flex-row">
				{/* Left Side of screen */}
				<div
					className={`${
						showTerminal ? `w-3/5` : 'w-full'
					} h-full flex flex-col`}
				>
					<ChallengeToolsBar
						onClickTerminal={() => {
							setCmdSize(cmdSize === 2 ? 3 : 2);
						}}
					/>
					{editMode ? (
						<LineInterface
							className="h-full"
							key="edit-mode"
							hasTabs
							lang={challenge.lang}
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
							className="h-full"
							key="play-mode"
							initialContent={initialCode}
							handleChange={lineInterfaceContentChanges}
						/>
					)}
				</div>
				{showTerminal && (
					<div className={`h-full w-2/5`}>
						<Cmd ref={cmdRef} />
					</div>
				)}
			</div>
		</div>
	);
};

export default ChallengeCode;
