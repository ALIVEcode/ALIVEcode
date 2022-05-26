import styled from 'styled-components';
import { AIDataset } from '../../../Models/Ai/ai_dataset.entity';

/**
 * This interface represents every property of a ChallengeTable.
 *
 * @param className the names of optional CSS classes.
 * @param data the dataset to display in the table, if applicable.
 * @param hyperparams the hyperparameters to display in the table, if applicable.
 * @param isData a boolean telling if the table represents a dataset or the hyperparameters.
 *
 * @author Félix Jobin
 */
export interface ChallengeTableProps {
	className?: string;
	data?: AIDataset;
	hyperparams?: any;
	isData: boolean;
	handleHyperparamsChange?: (newHyperparams: any) => void;
}

/**
 * This component represents the CSS code for every ChallengeTable component.
 *
 * @author Félix Jobin
 */
export const StyledChallengeTable = styled.div`
	.body {
		font-size: 11px;
		border-style: none;
		color: var(--foreground-color);
		text-align: center;
		margin-bottom: 0;
		margin-left: auto;
		margin-right: auto;
	}

	.titles {
		font-size: 16px;
		line-height: 18px;
		font-weight: bolder;
		background-color: var(--secondary-color);
		width: 50px;
		padding: 5px;
		position: sticky;
		top: 0;
	}

	.data {
		background-color: var(--tableback-color);
		border-top: 0.1vh solid var(--databack-color);
	}

	.data-number {
		background-color: var(--secondary-color);
		border-top: 0.1vh solid var(--databack-color);
	}

	.hyperparam-name {
		font-weight: bold;
	}

	.hyperparam-value {
		border-left: 0.1vh solid var(--databack-color);
	}

	.inputs {
		background-color: var(--tableback-color);
		text-align: center;
		border: 2px solid var(--secondary-color);
	}

	td {
		padding: 6px;
		text-align: center;
		justify-content: center;
		font-size: 14px;
	}
`;
