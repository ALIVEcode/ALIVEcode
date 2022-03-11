import { useContext, useState } from 'react';
import { ChallengeContext } from '../../../state/contexts/LevelContext';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import { UserContext } from '../../../state/contexts/UserContext';
import {
	faBookOpen,
	faCog,
	faPauseCircle,
	faPencilAlt,
	faPlayCircle,
	faQuestionCircle,
} from '@fortawesome/free-solid-svg-icons';
import useRoutes from '../../../state/hooks/useRoutes';
import { ChallengeToolsBarProps } from './levelToolsBarTypes';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';

const ChallengeToolsBar = ({ onClickPlay }: ChallengeToolsBarProps) => {
	const { user } = useContext(UserContext);
	const {
		challenge: level,
		editMode,
		saving,
		saved,
		executor,
		setOpenSettings,
	} = useContext(ChallengeContext);
	const { routes, goToNewTab } = useRoutes();
	const [editTitle, setEditTitle] = useState(false);
	const forceUpdate = useForceUpdate();

	return (
		<div className="tools-bar">
			{editMode && editTitle ? (
				<input
					type="text"
					autoFocus
					onBlur={() => setEditTitle(false)}
					defaultValue={level!.name}
				/>
			) : (
				<label
					className="level-title"
					onClick={() => editMode && setEditTitle(true)}
				>
					{level ? level.name : 'Sans nom'}
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
			{user && !editMode && user.id === level?.creator?.id && (
				<IconButton
					to={routes.auth.challenge_edit.path.replace(':levelId', level.id)}
					icon={faPencilAlt}
					size="2x"
				/>
			)}
			<IconButton
				onClick={() => goToNewTab(routes.public.asDocs.path)}
				icon={faBookOpen}
				size="2x"
			/>
			<IconButton icon={faQuestionCircle} size="2x" />
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
