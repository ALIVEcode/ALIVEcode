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
	initData?: AIDataset;
	hyperparams?: any;
	isData: boolean;
	ioCodes?: number[];
	handleIOChange?: (newIO: number[]) => void;
	handleHyperparamsChange?: (newHyperparams: any) => void;
}

/**
 * This component represents the name associated with his hyperparam
 */
export const HyperparamID: any = {
	nbInputs: {
		name: "Nombre de paramètres d'entrée",
		componant: 'integer input',
	}, //
	nbOutputs: {
		name: 'Nombre de paramètres de sortie',
		componant: 'integer input',
	}, //
	neuronsByLayer: {
		name: 'Nombre de neuronnes par couche',
		componant: 'input',
	},
	activationsByLayer: {
		name: "Fonction d'activation par couches",
		componant: 'ACTIVATION_FUNCTIONS',
	},
	costFunction: {
		name: 'Fonction de coût',
		componant: 'COST_FUNCTIONS',
	},
	learningRate: {
		name: "Taux d'apprentissage",
		componant: 'input',
	}, //Nombre réel
	epochs: { name: "Nombre d'epochs", componant: 'integer input' }, //
	type: {
		name: "Type d'optimiseur",
		componant: 'MODEL_TYPES',
	},
};

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
		border-left: 1px solid var(--databack-color);
		border-right: 1px solid var(--databack-color);

		padding-top: 0.5vh;
		padding-left: 3px;
		padding-right: 3px;
		width: 50px;
		position: sticky;
		top: 0;
	}

	.data {
		background-color: var(--tableback-color);
		border-top: 0.1vh solid var(--databack-color);
		font-size: 12px;
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
		border-radius: 6px;
	}

	td {
		padding: 6px;
		text-align: center;
		justify-content: center;
		font-size: 14px;
	}

	.io {
		font-size: 12px;
		border-bottom: 1px solid var(--databack-color);
		background-color: var(--secondary-color);
		border-left: 1px solid var(--databack-color);
		border-right: 1px solid var(--databack-color);
		padding: 0.5vh;
	}

	.input-header {
		background-color: var(--input-header-color);
	}

	.input-data {
		background-color: var(--input-data-color);
	}

	.output-data {
		background-color: var(--output-data-color);
	}

	.output-header {
		background-color: var(--output-header-color);
	}
`;
