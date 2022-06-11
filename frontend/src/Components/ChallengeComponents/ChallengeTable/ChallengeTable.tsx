import { useCallback, useEffect, useRef, useState } from 'react';
import {
	Hyperparameters,
	NNHyperparameters,
	RegHyperparameters,
} from '../../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtilsInterfaces';
import {
	ChallengeTableProps,
	StyledChallengeTable,
	HyperparamID as HyperparamTranslator,
} from './challengeTableTypes';

import {
	COST_FUNCTIONS,
	ACTIVATION_FUNCTIONS,
	NN_OPTIMIZER_TYPES,
	MODEL_TYPES,
} from '../../../Models/Ai/ai_model.entity';
import { data } from 'jquery';
import { init } from 'i18next';
import useComplexState from '../../../state/hooks/useComplexState';
import { defaultHyperparams } from '../../../Pages/Challenge/ChallengeAI/artificial_intelligence/ai_models/DefaultHyperparams';
import { GenHyperparameters } from '../../../Pages/Challenge/ChallengeAI/artificial_intelligence/AIUtilsInterfaces';

/**
 * This module defines all properties related to the data table in AI challenges.
 * The structure of the table is described in this object while the style of
 * the table is set in ChallengeTableTypes.
 * @param props the props of the table
 */
const ChallengeTable = (props: ChallengeTableProps) => {
	const [currHyperparams, setCurrHyperparams] = useState(props.hyperparams); //The current hyperparams of the table

	//Function called after a change on hyperparams.
	useEffect(() => {
		if (props.handleHyperparamsChange && currHyperparams)
			props.handleHyperparamsChange(currHyperparams);
	}, [currHyperparams]);

	/**
	 * Callback function called whenever a new value is entered in an input field associated
	 * with an hyperparameter. Changes the hyperparameter object and sends its new
	 * value to its parent component.
	 * @param newValue the hyperparameter's new value as a string.
	 * @param key the key name of the hyperparameter to change.
	 */
	const updateHyperparams = (
		newValue: string,
		key: keyof Hyperparameters,
	): void => {
		let newNumValue: number = 0;

		// If hyperparams object of handleHyperparams function is null, cancel.
		if (!props.handleHyperparamsChange) return;

		let tempHyperparams: Hyperparameters = JSON.parse(
			JSON.stringify(currHyperparams),
		);

		if (props.activeModelType) {
			// Determine the type of the hyperparam
			switch (HyperparamTranslator![key].componant) {
				case 'integer input':
					newNumValue = parseInt(newValue);
					(tempHyperparams[key] as number) = newNumValue;
					break;
				case 'input':
					newNumValue = parseFloat(newValue);
					(tempHyperparams[key] as number) = newNumValue;
					break;
				default:
					(tempHyperparams[key] as string) = newValue;
			}

			setCurrHyperparams(tempHyperparams);
		}
	};

	/**
	 * Sets the IOCodes after a change in the interface.
	 * @param value the selected value in the interface.
	 * @param index the index of the column in which the code was changed.
	 */
	const setIOCode = useCallback(
		(value: string, index: number) => {
			let array: number[] = props.ioCodes!;
			switch (value) {
				case '1':
					array[index] = 1;
					break;
				case '0':
					array[index] = 0;
					break;
				default:
					array[index] = -1;
			}
			props.handleIOChange && props.handleIOChange(array);
		},
		[props],
	);

	/**
	 * Returns the step associated with the hyperparameter.
	 * @param key the hyperparameter
	 * @returns the step of the hyperparameter
	 */
	function inputStep(key: string) {
		if (HyperparamTranslator![key]['componant'] === 'input') return '0.01';
		else return '1';
	}

	/**
	 * Returns a boolean about if a dropdown shoulds be disable or not
	 * @param index the index of the dropdown
	 * @returns If the dropdown is disable or not
	 */
	function disableDropdown(index: number) {
		const header = props.data?.getParamNames().at(index);
		if (props.initData!.getParamNames().indexOf(header!) === -1) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Returns the className property of a cell in the Data table depending on its state
	 * (input, output or unused) and its nature (header or data).
	 * @param isHeader true if the cell is a header, false otherwise.
	 * @param initialClassName the beginning of the cell's className.
	 * @param index the column number of the cell.
	 * @returns the className property of the cell.
	 */
	function setDataTabClassName(
		isHeader: boolean,
		initialClassName: string,
		index: number,
	): string {
		let className: string = initialClassName;
		if (isHeader) {
			// For header components
			if (props.ioCodes![index] === 1) className += ' input-header';
			else if (props.ioCodes![index] === 0) className += ' output-header';
			else className += ' ignore-header';
		} else {
			// For data components
			if (props.ioCodes![index] === 1) className += ' input-data';
			else if (props.ioCodes![index] === 0) className += ' output-data';
			else className += ' ignore-data';
		}
		return className;
	}

	/**
	 * Returns a component representing the headers of this ChallengeTable
	 * @returns the headers in a component.
	 */
	function renderTableHeaders() {
		if (props.data && props.isData && props.ioCodes)
			return (
				<>
					<tr>
						{props.data.getParamNames().map((param: string, index: number) => {
							return (
								<th
									key={index}
									className={setDataTabClassName(
										true,
										'titles data-header',
										index,
									)}
								>
									<div className="h-full w-full flex flex-col justify-between">
										<div className="h-full flex items-center justify-center">
											<div className="param-name">{param}</div>
										</div>
										<select
											className="inputs"
											onChange={e => setIOCode(e.target.value, index)}
											disabled={disableDropdown(index)}
											value={props.ioCodes[index]}
										>
											<option value={-1}>Ignorée</option>
											<option value={1}>Entrée</option>
											<option value={0}>Sortie</option>
										</select>
									</div>
								</th>
							);
						})}
					</tr>
				</>
			);
		if (props.activeModelType && !props.isData)
			return (
				<tr>
					<th className="titles hyperparam-header">Hyperparamètre</th>
					<th className="titles hyperparam-header">Valeur</th>
				</tr>
			);
	}

	/**
	 * Returns a component representing the data rows of this ChallengeTable.
	 * @returns the data in a component.
	 */
	function renderTableData() {
		if (props.data && props.isData)
			return (
				<>
					{props.data.getDataForTable().map((dataLine: any, row: number) => {
						return (
							<tr key={row}>
								{dataLine.map((element: any, col: number) => {
									return (
										<td
											key={col}
											className={setDataTabClassName(false, 'data', col)}
										>
											{typeof element === 'number'
												? Math.round(element * 10000) / 10000
												: element}
										</td>
									);
								})}
							</tr>
						);
					})}
				</>
			);
		if (currHyperparams && !props.isData) {
			return (
				<>
					{Object.keys(currHyperparams).map((key: string, index: number) => {
						return (
							<tr key={index}>
								<td className="hyperparam-name data">
									{addHyperparamName(key)}
								</td>
								<td className="hyperparam-value data">
									{addHypperparamInput(key as keyof Hyperparameters)}
								</td>
							</tr>
						);
					})}
				</>
			);
		}
	}

	/**
	 * Returns the name associated with the hyperparameter.
	 * @param key the hyperparameter
	 * @returns the name of the hyperparameter
	 */
	const addHyperparamName = useCallback((key: string) => {
		if (!HyperparamTranslator) return 'Erreur';
		return HyperparamTranslator![key]['name'];
	}, []);

	/**
	 * Returns the input component associated with the hyperparameter.
	 * @param key the hyperparameter
	 * @returns the component corresponding to the hyperparameter
	 */
	function addHypperparamInput(key: keyof Hyperparameters) {
		if (
			HyperparamTranslator![key]['componant'] === 'integer input' ||
			HyperparamTranslator![key]['componant'] === 'input'
		) {
			// Returned component if the hyperparam needs an input field

			return (
				currHyperparams &&
				props.handleHyperparamsChange && (
					<input
						className="inputs"
						type="number"
						onBlur={e => {
							props.handleHyperparamsChange(currHyperparams);
						}}
						value={currHyperparams[key]}
						onChange={e => {
							updateHyperparams(e.target.value, key);
						}}
						onKeyPress={event => {
							if (
								!(
									/[0-9]/.test(event.key) ||
									/[.]/.test(event.key) ||
									/[,]/.test(event.key)
								)
							) {
								event.preventDefault();
							}
						}}
						step={inputStep(key)}
						min="0"
					></input>
				)
			);
		}
		var keys: any[];
		var values: any[];

		switch (HyperparamTranslator![key]['componant']) {
			case 'NN_OPTIMIZER_TYPES': {
				values = Object.values(NN_OPTIMIZER_TYPES);
				keys = Object.keys(NN_OPTIMIZER_TYPES);
				break;
			}
			case 'ACTIVATION_FUNCTIONS': {
				values = Object.values(ACTIVATION_FUNCTIONS);
				keys = Object.keys(ACTIVATION_FUNCTIONS);
				break;
			}
			case 'MODEL_TYPES': {
				values = Object.values(MODEL_TYPES);
				keys = Object.keys(MODEL_TYPES);
				break;
			}
			case 'COST_FUNCTIONS': {
				values = Object.values(COST_FUNCTIONS);
				keys = Object.keys(COST_FUNCTIONS);
				break;
			}
			default: {
				values = [];
				keys = [];
			}
		}
		return (
			<select
				className="inputs"
				onChange={e => updateHyperparams(e.target.value, key)}
			>
				{values.map((index: number) => {
					let i = values.indexOf(index);
					return (
						<option key={index} value={index}>
							{keys.at(i)}
						</option>
					);
				})}
			</select>
		);
	}

	return (
		<StyledChallengeTable
			className={
				'w-full h-full overflow-x-auto overflow-y-auto ' + props.className
			}
		>
			<table
				className={
					props.isData ? 'body self-center w-full' : 'body self-center w-5/6'
				}
			>
				<tbody>
					{renderTableHeaders()}
					{renderTableData()}
				</tbody>
			</table>
		</StyledChallengeTable>
	);
};

export default ChallengeTable;
