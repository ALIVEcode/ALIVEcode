import { Level, LEVEL_TYPE } from "../../Models/Level/level.entity";
import styled from 'styled-components';

export interface LevelProps {
	editMode: boolean;
	level?: Level;
	type?: LEVEL_TYPE;
}

export type typeAskForUserInput = (
	msg: string,
	callback: (inputValue: string) => void,
) => void;

export type typeAction = {
	label: string;
	type: 'NORMAL' | 'GET' | 'SET' | 'ERROR';
	apply: (params: any[], dodo?: number, response?: any[]) => any;
	handleNext?: boolean;
};

type StyledProps = {
	editMode: boolean;
};

export const StyledLevel = styled.div`
	.row {
		padding: 0px;
		margin: 0px;
	}

	.left-col {
		padding: 0px;
		display: flex;
		flex-flow: column;
		overflow-y: hidden;
		position: sticky;
	}

	.right-col {
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
`;