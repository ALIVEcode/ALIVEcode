import { useRef, useState } from 'react';
import {
	ChallengeTableProps,
	StyledChallengeTable,
	HyperparamID,
} from './challengeTableTypes';

import {
	COST_FUNCTIONS,
	ACTIVATION_FUNCTIONS,
	NN_OPTIMIZER_TYPES,
	MODEL_TYPES,
} from '../../../Models/Ai/ai_model.entity';
import { data } from 'jquery';
import { init } from 'i18next';

/**
 * This module defines all properties related to the data table in AI challenges.
 * The structure of the table is described in this object while the style of
 * the table is set in ChallengeTableTypes.
 * @param props the props of the table
 * @returns
 */
const ChallengeTable = (props: ChallengeTableProps) => {
	const [currHyperparams, setCurrHyperparams] = useState<any>(
		props.hyperparams,
	);

	function updateHyperparams(
		e: React.FocusEvent<HTMLInputElement, Element>,
		newValue: any,
		key: string,
	): void {
		if (HyperparamID![key]['componant'] == 'integer input') {
			e.target.value = Number(parseInt(newValue)).toString();
			newValue = e.target.value;
		}
		let tempHyperparams: any = currHyperparams;
		console.log(newValue);
		tempHyperparams[key] = newValue;
		setCurrHyperparams(tempHyperparams);
		props.handleHyperparamsChange!(currHyperparams);
	}

	/**
	 * Sets the IOCodes after a change in the interface.
	 * @param value the selected value in the interface.
	 * @param index the index of the column in which the code was changed.
	 */
	function setIOCode(value: string, index: number) {
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
		props.handleIOChange!(array);
	}

	/**
	 * Returns the name associated with the hyperparameter.
	 * @param key the hyperparameter
	 * @returns the name of the hyperparameter
	 */
	function nameHyperparam(key: string) {
		return HyperparamID![key]['name'];
	}

	/**
	 * Returns the step associated with the hyperparameter.
	 * @param key the hyperparameter
	 * @returns the step of the hyperparameter
	 */
	function inputStep(key: string) {
		if (HyperparamID![key]['componant'] === 'input') return '0.01';
		else return '1';
	}

	/**
	 * Returns a boolean about if a dropdown shoulds be disable or not
	 * @param index the index of the dropdown
	 * @returns If the dropdown is disable or not
	 */
	 function disableDropdown(index : number){
		const header = props.data?.getParamNames().at(index)
		if (props.initData!.getParamNames().indexOf(header!)=== -1){
			return true
		}else{
			return false
		}
	}

	/**
	 * Returns the component associated with the hyperparameter.
	 * @param key the hyperparameter
	 * @returns the component corresponding to the hyperparameter
	 */
	function addHypperparamInput(key: string) {
		if (
			HyperparamID![key]['componant'] === 'integer input' ||
			HyperparamID![key]['componant'] === 'input'
		)
			return (
				<input
					className="inputs"
					type="number"
					onBlur={e => {
						updateHyperparams(e, e.target.value, key);
					}}
					defaultValue={props.hyperparams![key]}
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
			);
		else var keys: any[];
		var values: any[];

		switch (HyperparamID![key]['componant']) {
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
			<select className="inputs">
				{values.map((index: number) => {
					let i = values.indexOf(index);
					return <option value={index}>{keys.at(i)}</option>;
				})}
			</select>
		);
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
			if (props.ioCodes![index] === 1) className += ' input-header';
			else if (props.ioCodes![index] === 0) className += ' output-header';
			else className += ' ignore-header';
		} else {
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
								<th className={setDataTabClassName(true, 'titles', index)}>
									{param}
								</th>
							);
						})}
					</tr>

					<tr>
						{props.ioCodes.map((code: number, index: number) => {
							return (
								<th className={setDataTabClassName(true, 'io', index)}>
									<select
										className="inputs"
										onChange={e => setIOCode(e.target.value, index)}
										disabled={disableDropdown(index)}
										value={code}
									>
										<option value={-1}>Ignorée</option>
										<option value={1}>Entrée</option>
										<option value={0}>Sortie</option>
									</select>
								</th>
							);
						})}
					</tr>
				</>
			);
		if (props.hyperparams && !props.isData)
			return (
				<tr>
					<th className="titles">Hyperparamètre</th>
					<th className="titles">Valeur</th>
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
										<td className={setDataTabClassName(false, 'data', col)}>
											{typeof element === 'number'? Math.round(element * 10000) / 10000 : element}
										</td>
									);
								})}
							</tr>
						);
					})}
				</>
			);
		if (props.hyperparams && !props.isData)
			return (
				<>
					{Object.keys(props.hyperparams).map((key: string, index: number) => {
						return (
							<tr>
								<td className="hyperparam-name data">{nameHyperparam(key)}</td>
								<td className="hyperparam-value data">
									{addHypperparamInput(key)}
								</td>
							</tr>
						);
					})}
				</>
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
