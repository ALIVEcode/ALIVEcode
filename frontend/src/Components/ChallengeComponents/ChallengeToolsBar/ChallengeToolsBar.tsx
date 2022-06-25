import { useContext, useState } from 'react';
import { ChallengeContext } from '../../../state/contexts/ChallengeContext';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import { UserContext } from '../../../state/contexts/UserContext';
import {
	faCog,
	faPauseCircle,
	faPencilAlt,
	faPlayCircle,
	faQuestionCircle,
	faTerminal,
} from '@fortawesome/free-solid-svg-icons';
import useRoutes from '../../../state/hooks/useRoutes';
import { ChallengeToolsBarProps } from './challengeToolsBarTypes';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';

const ChallengeToolsBar = ({
	onClickPlay,
	onClickTerminal,
}: ChallengeToolsBarProps) => {
	const { user } = useContext(UserContext);
	const { challenge, editMode, saving, saved, executor, setOpenSettings } =
		useContext(ChallengeContext);
	const { routes } = useRoutes();
	const [editTitle, setEditTitle] = useState(false);
	const forceUpdate = useForceUpdate();

	return (
		<div className="tools-bar">
			{editMode && editTitle ? (
				<input
					type="text"
					autoFocus
					onBlur={() => setEditTitle(false)}
					defaultValue={challenge!.name}
				/>
			) : (
				<label
					className="challenge-title"
					onClick={() => editMode && setEditTitle(true)}
				>
					{challenge ? challenge.name : 'Sans nom'}
				</label>
			)}
			{editMode && (
				<>
					<IconButton
						onClick={() => setOpenSettings(true)}
						icon={faCog}
						size="2x"
					/>
				</>
			)}
			{user && !editMode && user.id === challenge?.creator?.id && (
				<IconButton
					to={routes.auth.challenge_edit.path.replace(
						':challengeId',
						challenge.id,
					)}
					icon={faPencilAlt}
					size="2x"
				/>
			)}
			{/*
			TODO: FIX AS Docs
			<IconButton
				onClick={() => goToNewTab(routes.public.asDocs.path)}
				icon={faBookOpen}
				size="2x"
			/>
			 */}
			{/*
			TODO: Add hints?
			<IconButton icon={faQuestionCircle} size="2x" />
			<IconButton
				onClick={() => {
					onClickTerminal && onClickTerminal();
				}}
				icon={faTerminal}
				size="2x"
			/>
			{/* Do not change the onClick method!! it MUST be a method that calls the toggleExecution */}
			<IconButton
				onClick={() => {
					if (onClickPlay) return onClickPlay();
					forceUpdate();
					executor.current?.toggleExecution();
				}}
				icon={executor.current?.execution ? faPauseCircle : faPlayCircle}
				size="2x"
			/>
			{(saving || saved) && (
				<label className="save-message">
					{saving && 'Sauvegarde en cours...'}
					{saved && 'Niveau sauvegardé ✔'}
				</label>
			)}
		</div>
	);
};

export default ChallengeToolsBar;
