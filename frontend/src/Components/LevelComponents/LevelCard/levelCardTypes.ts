import { Level } from '../../../Models/Level/level.entity';
import { LevelAlive } from '../../../Models/Level/levelAlive.entity';
import { LevelCode } from '../../../Models/Level/levelCode.entity';
import styled from 'styled-components';

export type LevelCardProps = {
	level: LevelAlive | LevelCode | Level;
	enterEdit?: boolean;
};

export const StyledLevelCard = styled.div`
	background-color: var(--primary-color);
	margin: 10px;
	border-radius: 10px;
	transition: 0.2s;
	color: white;

	.content {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 40px;
	}

	.footer {
		margin-top: 20px;
		border-top: 2px solid var(--bg-shade-two-color);
		padding: 15px 40px 15px 40px;
		display: flex;
		justify-content: space-between;
		font-size: 0.8em;
		color: rgb(255, 255, 255, 0.7);
	}

	.level-name {
		font-size: 2.5em;
	}

	.level-tags {
		font-size: 1.2em;
		margin-bottom: 10px;
	}

	.details-section {
	}

	.info-section {
		display: flex;
		flex-direction: column;
	}

	.buttons-section {
		display: flex;
	}

	.level-button {
		margin-left: 10px;
		cursor: pointer;
	}
`;
