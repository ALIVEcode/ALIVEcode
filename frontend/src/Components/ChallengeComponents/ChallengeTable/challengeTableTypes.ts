import styled from 'styled-components';
import { AIDataset } from '../../../Models/Ai/ai_dataset.entity';
import { OneOf } from '../../../Types/utils';
import {
	GenHyperparameters,
	Hyperparameters,
} from '../../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtilsInterfaces';
import { MODEL_TYPES } from '../../../Models/Ai/ai_model.entity';

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
export type ChallengeTableProps = {
	className?: string;
	initData?: AIDataset;
	isData: boolean;
	ioCodes: number[];
	activeIoCodes: number[];
} & OneOf<
	{
		data: AIDataset;
		handleIOChange: (activeNewIO: number[], newIO: number[]) => void;
	},
	{
		hyperparams: Hyperparameters;
		activeModelType: MODEL_TYPES;
		handleHyperparamsChange: (newHyperparams: Hyperparameters) => void;
	}
>;

/**
 * This component represents the name associated with his hyperparam
 */
export const HyperparamID: any = {
	nbInputs: {
		name: "Nombre de paramètres d'entrée",
		component: 'disable integer field',
	}, //
	nbOutputs: {
		name: 'Nombre de paramètres de sortie',
		component: 'disable integer field',
	}, //
	neuronsByLayer: {
		name: 'Nombre de neurones par couche',
		component: 'multiple fields / addButton',
	},
	activationsByLayer: {
		name: "Fonction d'activation par couche",
		component: 'multiple ACTIVATION_FUNCTIONS',
	},
	costFunction: {
		name: 'Fonction de coût',
		component: 'COST_FUNCTIONS',
	},
	learningRate: {
		name: "Taux d'apprentissage",
		component: 'field',
	},
	epochs: { name: "Nombre d'epochs", component: 'integer field' }, //
	type: {
		name: "Type d'optimiseur",
		component: 'NN_OPTIMIZER_TYPES',
	},
	modelParams: {
		name: 'Paramètres du modèle',
		component: 'multiple fields',
	},
	activation: {
		name: "Fonction d'activation",
		component: 'ACTIVATION_FUNCTIONS',
	}
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
		width: 100%;
	}

	.titles {
		background-color: var(--secondary-color);
		border-left: 0.1vh solid var(--bg-shade-one-color);
		border-right: 0.1vh solid var(--bg-shade-one-color);
		padding: 5px;
		position: sticky;
		top: 0;
	}

	.data-header {
		height: 80px;
	}

	.param-name {
		font-size: 14px;
		padding-bottom: 5px;
		line-height: 15px;
		font-weight: bolder;
	}

	.hyperparam-header {
		height: 40px;
		font-size: 20px;
		font-weight: bolder;
	}

	.data {
		background-color: var(--tableback-color);
		border: 0.1vh solid var(--databack-color);
		font-size: 12px;
		max-width: 10vw;
	}

	.hyperparam-data {
		border-top: 0.1vh solid var(--databack-color);
	}

	.data-number {
		background-color: var(--secondary-color);
	}

	.hyperparam-name {
		font-weight: bold;
		font-size: 14px;
	}

	.inputs {
		background-color: var(--tableback-color);
		text-align: center;
		border: 2px solid var(--secondary-color);
		border-radius: 6px;
		font-size: 12px;
		padding: 2px;
	}

	td {
		padding: 6px;
		text-align: center;
		justify-content: center;
		font-size: 14px;
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
