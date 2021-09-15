import styled from 'styled-components';
import FillContainer from '../../../Components/UtilsComponents/FillContainer/FillContainer';
import { LevelProgression } from '../../../Models/Level/levelProgression';
import { LevelAI } from '../../../Models/Level/levelAI.entity';

export interface LevelAIProps {
	level: LevelAI;
	editMode: boolean;
	progression?: LevelProgression;
	setProgression: (progression: LevelProgression) => void;
	setLevel: (level: LevelAI) => void;
}

type StyledProps = {
	editMode: boolean;
};

export const StyledAliveLevel = styled(FillContainer)`
	.row {
		padding: 0;
		margin: 0;
	}

	.left-col {
		padding: 0;
		display: flex;
		flex-flow: column;
	}

	.tools-bar {
		display: flex;
		align-items: center;
		background-color: var(--primary-color);
		border: none;
		padding: 5px;
	}

	.level-title {
		color: var(--foreground-color);
		padding: 0px 10px 0px 10px;
		${({ editMode }: StyledProps) => editMode && 'cursor: pointer'};
		margin-bottom: 0;
		font-size: 1.2em;
	}

	.save-message {
		color: rgba(var(--foreground-color), 0.8);
		margin-bottom: 0;
	}

	.icon-button {
		margin: 0px 3px 0px 3px;
	}

	.editors-tab {
		display: flex;
		background-color: rgba(var(--primary-color-rgb), 0.8);
	}

	.editors-tab::before {
		width: 100%;
		height: 100%;
		position: absolute;
		background-color: black;
		content: '';
		z-index: -1;
		border-bottom: 1px solid var(--foreground-color);
	}

	.graph-container {
		background-color: var(--pale-color);
		padding: 20px
	}
`;