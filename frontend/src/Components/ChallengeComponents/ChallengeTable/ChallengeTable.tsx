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
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';

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
		index?: number,
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
				case 'multiple inputs':
					newNumValue = parseInt(newValue);
					const obj = tempHyperparams[key] as Object
					const array = obj as number[]
					array[index!] = newNumValue;
					break;
				case 'ACTIVATION_FUNCTIONS':
					const obj2 = tempHyperparams[key] as Object
					const array2 = obj2 as string[]
					array2[index!] = newValue;
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
			let activeArray: number[] = props.activeIoCodes!;

			//Set up to change the initial iocodes
			let initParams = props.initData!.getParamNames()
			let currentParams = props.data!.getParamNames()
			let columnName = currentParams[index]
			let i = initParams.indexOf(columnName)
			let initArray = props.ioCodes!
			

			//Change the iocodes
			switch (value) {
				case '1':
					activeArray[index] = 1;
					initArray[i] = 1
					break;
				case '0':
					activeArray[index] = 0;
					initArray[i] = 0;
					break;
				default:
					activeArray[index] = -1;
					initArray[i] = -1;
			}

			props.handleIOChange && props.handleIOChange(activeArray, initArray);
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
			if (props.activeIoCodes[index] === 1) className += ' input-header';
			else if (props.activeIoCodes[index] === 0) className += ' output-header';
			else className += ' ignore-header';
		} else {
			// For data components
			if (props.activeIoCodes[index] === 1) className += ' input-data';
			else if (props.activeIoCodes[index] === 0) className += ' output-data';
			else className += ' ignore-data';
		}
		return className;
	}

	/**
	 * Returns a component representing the headers of this ChallengeTable
	 * @returns the headers in a component.
	 */
	function renderTableHeaders() {
		if (props.data && props.isData && props.activeIoCodes) {
			return (
				<>
					<tr>
						{props.data!.getParamNames().map((param: string, index: number) => {
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
											value={props.activeIoCodes[index]}
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
		}
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
		if (props.data && props.isData && props.activeIoCodes)
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
								<td className="hyperparam-name hyperparam-data data">
									{addHyperparamName(key)}
								</td>
								<td className="hyperparam-data data">
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
	 * Add another input to the neurones by layer cell
	 * @param add add or substract. If true, an input is added. If false, an input is substarted
	 * @param key the hyperparameter
	 */
	function layer(add: boolean, key: string) {
		if (props.handleHyperparamsChange && currHyperparams) {
			let tempHyperparams = JSON.parse(
				JSON.stringify(currHyperparams),
			);

			const obj = tempHyperparams[key] as Object
			const array = obj as number[]
			

			if (add) {
				array.push(1);
				tempHyperparams['activationsByLayer'].push('RE')
			} else {
				array.pop();
				tempHyperparams['activationsByLayer'].pop()
			}
			setCurrHyperparams(tempHyperparams);
			props.handleHyperparamsChange(tempHyperparams);
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
		const component = HyperparamTranslator![key]['componant'] as string
		if (component.includes('input')) {
			// Returned component if the hyperparam needs an input field
			if (!component.includes('multiple')) {
				return singleInputField(key)
			}else{ 
				return multipleInputFields(key)
			}
		}
		return creatDropBox(key)
	}


	/**
	 * Returns the input field associated with the hyperparameter.
	 * @param key the hyperparameter
	 * @returns the field corresponding to the hyperparameter
	 */
	function singleInputField(key: keyof Hyperparameters){
		const component = HyperparamTranslator![key]['componant'] as string
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
					disabled={component.includes('disable')}
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
					min='0'
				></input>
			)
		);
	}

	/**
	 * Returns the input fields associated with the hyperparameter.
	 * @param key the hyperparameter
	 * @returns the fields corresponding to the hyperparameter
	 */
	function multipleInputFields(key: keyof Hyperparameters){
		if (
			currHyperparams &&
			props.handleHyperparamsChange
		) {
			// Returned component if the hyperparam needs multiple input fields
			const obj = currHyperparams[key] as Object
			const array = obj as number[]
			const inputFieldNb: number =array.length;
			let inputArray = [];

			for (let i = 0; i < inputFieldNb; i++) {
				inputArray.push(
					<div className="input-container">
						<label>Couche {i + 1} : </label>
						<input
							className="inputs my-1"
							type="number"
							value={array[i]}
							onBlur={e => {
								props.handleHyperparamsChange(currHyperparams);
							}}
							onChange={e => {
								updateHyperparams(e.target.value, key, i);
							}}
							step="1"
							min="1"
						></input>
					</div>,
				);
			}

			inputArray.push(
				<div className="input-container my-1">
					<button
						className="w-5/12 mx-0.5 rounded-md text-white text-base font-medium transition-colors hover:bg-[color:var(--contrast-color)] bg-[color:var(--primary-color)] btn-clearCmdLines"
						onClick={e => layer(true, key)}
					>
						{' '}
						+{' '}
					</button>
					<button
						className="w-5/12 mx-0.5 rounded-md text-white text-base font-medium transition-colors hover:bg-[color:var(--contrast-color)] bg-[color:var(--primary-color)] btn-clearCmdLines"
						onClick={e => layer(false, key)}
					>
						{' '}
						-{' '}
					</button>
				</div>,
			);

			return inputArray;
		}
	}

	/**
	 * Returns the input dropdown associated with the hyperparameter.
	 * @param key the hyperparameter
	 * @returns the dropdown corresponding to the hyperparameter
	 */
	function creatDropBox(key: keyof Hyperparameters){
		let keys: any[] = [];
		let values: any[] = [];
		let inputs: any[] =[];
		var obj: Object
		let array: number[] = []
		let dropboxdNb = 1

		switch (HyperparamTranslator![key]['componant']) {
			case 'NN_OPTIMIZER_TYPES': {
				values = Object.values(NN_OPTIMIZER_TYPES);
				keys = Object.keys(NN_OPTIMIZER_TYPES);
				break;
			}
			case 'ACTIVATION_FUNCTIONS': {
				values = Object.values(ACTIVATION_FUNCTIONS);
				keys = Object.keys(ACTIVATION_FUNCTIONS);
				obj = currHyperparams![key] as Object
				array = obj as number[]
				dropboxdNb =array.length;
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
			}
		}
		if(dropboxdNb === 1){
			//Creat one dropdown
			inputs.push(
					<select
						className="inputs"
						onChange={e => updateHyperparams(e.target.value, key)}
						onBlur={e => {
							props.handleHyperparamsChange!(currHyperparams!);
						}}
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
				)
		}else{
		//Creat multiple dropdowns
			for (let index = 0; index < dropboxdNb; index++) {
				inputs.push(
					<div className="input-container">
						<label>Couche {index+1 === dropboxdNb? 'de sortie':index + 1} : </label>
						<select
							className="inputs my-1"
							value={array![index]}
							onChange={e => updateHyperparams(e.target.value, key, index)}
							onBlur={e => {
								props.handleHyperparamsChange!(currHyperparams!);
							}}
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
					</div>,
				)
			}
		}
		return inputs
	}

	return (
		<StyledChallengeTable
			className={
				(props.isData
					? 'self-center w-full '
					: 'self-center w-5/6 overflow-auto ') + props.className
			}
		>
			<table className="body">
				<tbody>
					{renderTableHeaders()}
					{renderTableData()}
				</tbody>
			</table>
		</StyledChallengeTable>
	);
};

export default ChallengeTable;
