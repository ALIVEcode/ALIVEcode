import { IoTComponentEditorProps } from './iotComponentEditorTypes';
import { IoTProgressBar } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTProgressBar';
import IoTGenericComponent from '../../IoTProjectComponents/IoTGenericComponent/IoTGenericComponent';
import { IoTButton } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTButton';
import {
	IoTLogModel,
	IoTLogs,
} from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLogs';
import Button from '../../../UtilsComponents/Buttons/Button';
import Link from '../../../UtilsComponents/Link/Link';
import DateTime from 'react-datetime';
import moment from 'moment';
import AlertConfirm from '../../../UtilsComponents/Alert/AlertConfirm/AlertConfirm';
import { useState, useEffect, useContext } from 'react';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';
import { IoTObject } from '../../../../Models/Iot/IoTobject.entity';
import api from '../../../../Models/api';
import { IoTProjectContext } from '../../../../state/contexts/IoTProjectContext';
import { IoTLed } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLed';
import { IoTLabel } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLabel';
import { IoTBuzzer } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTBuzzer';
import InputGroup from '../../../UtilsComponents/InputGroup/InputGroup';
import FormLabel from '../../../UtilsComponents/FormLabel/FormLabel';
import { IoTComponent } from '../../../../Models/Iot/IoTProjectClasses/IoTComponent';
import {
	IoTTrafficLight,
	TRAFFIC_LIGHT_STATE,
} from '../../../../Models/Iot/IoTProjectClasses/Components/IoTTrafficLight';

const IoTComponentEditor = ({
	component,
	onClose,
}: IoTComponentEditorProps) => {
	const [openDeleteMenu, setOpenDeleteMenu] = useState(false);
	const [iotObjects, setIoTObjects] = useState<IoTObject[]>();
	const alert = useAlert();
	const { t } = useTranslation();
	const { project, canEdit } = useContext(IoTProjectContext);

	useEffect(() => {
		if (!(component instanceof IoTButton)) return;

		const getIoTObjects = async () => {
			const objects = await api.db.users.iot.getObjects({});
			setIoTObjects(objects);
		};

		getIoTObjects();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [component.type]);

	const removeComponent = () => {
		component.getComponentManager()?.removeComponent(component);
		onClose();
		alert.success(t('iot.project.remove_component.success'));
	};

	const getDocumentEntries = (
		component: IoTComponent,
	): { ref: string; value: any }[] => {
		if (!project?.document) return [];

		const res: { ref: string; value: any }[] = [];

		const getEntriesDeep = (entries: [string, any][], path: string) => {
			entries.forEach(entry => {
				const key = entry[0];
				const val = entry[1];
				if (component.validate(val)) {
					res.push({ ref: path + key, value: val });
				} else if (typeof val === 'object') {
					getEntriesDeep(Object.entries(val), path + key + '/');
				}
			}, []);
		};

		getEntriesDeep(Object.entries(project.document), '/document/');
		return res;
	};

	const renderDocumentEntries = () => {
		return (
			<>
				<option key="static" value="static">
					Static Value
				</option>
				{getDocumentEntries(component).map((e, idx) => (
					<option key={idx} value={e.ref}>
						{e.ref} {'  (' + e.value.toString()}
						{')'}
					</option>
				))}
			</>
		);
	};

	const renderStaticValue = () => {
		if (component instanceof IoTProgressBar)
			return (
				<InputGroup
					label="Value"
					type="range"
					min={component.getMin()}
					max={component.getMax()}
					value={component.value}
					className="mb-2"
					onChange={(e: any) => component.setValue(e.target.value)}
					disabled={!canEdit}
				/>
			);
		if (component instanceof IoTButton)
			return (
				<InputGroup
					label="Value (label)"
					value={component.value}
					className="mb-2"
					onChange={(e: any) => component.setValue(e.target.value)}
					disabled={!canEdit}
				/>
			);
		if (component instanceof IoTLogs)
			return (
				<>
					<FormLabel>Logs</FormLabel>
					{component.value.length === 0 && (
						<>
							<br />
							<div className="mb-5">
								No Logs
								{canEdit && (
									<>
										,{' '}
										<Link onClick={() => component.addLog('New log')} dark>
											add one?
										</Link>
									</>
								)}
							</div>
						</>
					)}
					{component.displayedValue.map((log: IoTLogModel, idx: number) => (
						<div key={idx} className="flex flex-row gap-4">
							<div className="w-full">
								<InputGroup
									as="textarea"
									className="mb-2"
									value={log.text}
									onChange={(e: any) =>
										component.updateLog(log, { ...log, text: e.target.value })
									}
									disabled={!canEdit}
								/>
							</div>
							<div className="w-full">
								<DateTime
									onChange={date => {
										if (moment.isMoment(date)) {
											component.updateLog(log, {
												...log,
												date: (date as moment.Moment).toDate(),
											});
										}
									}}
									className="date"
									initialValue={log.date}
								></DateTime>
							</div>
						</div>
					))}
					{component.value.length > 0 && (
						<>
							<Link onClick={() => component.addLog('New log')} dark>
								Add log
							</Link>
							<br />
							<Button
								className="mt-2"
								onClick={() => component.clearLogs()}
								variant="danger"
								disabled={!canEdit}
							>
								Clear logs
							</Button>
						</>
					)}
				</>
			);
		if (component instanceof IoTLed)
			return (
				<InputGroup
					label="LED on/off"
					type="checkbox"
					defaultChecked={component.value}
					className="mb-2"
					onChange={(e: any) => component.setValue(e.target.checked)}
					disabled={!canEdit}
				/>
			);
		if (component instanceof IoTLabel)
			return (
				<InputGroup
					label="Displayed Text"
					value={component.value}
					className="mb-2"
					onChange={(e: any) => component.setValue(e.target.value)}
					disabled={!canEdit}
				/>
			);
		if (component instanceof IoTBuzzer)
			return (
				<InputGroup
					label="Frequency"
					type="number"
					min={0}
					max={10000}
					value={component.value}
					className="mb-2"
					onChange={(e: any) => component.setValue(e.target.value)}
					disabled={!canEdit}
				/>
			);
		if (component instanceof IoTTrafficLight)
			return (
				<InputGroup
					label="LED on/off"
					as="select"
					defaultChecked={component.value}
					className="mb-2"
					onChange={(e: any) => component.setValue(e.target.value)}
					disabled={!canEdit}
				>
					<option id={TRAFFIC_LIGHT_STATE.OFF}>
						{TRAFFIC_LIGHT_STATE.OFF}
					</option>
					<option id={TRAFFIC_LIGHT_STATE.GREEN}>
						{TRAFFIC_LIGHT_STATE.GREEN}
					</option>
					<option id={TRAFFIC_LIGHT_STATE.YELLOW}>
						{TRAFFIC_LIGHT_STATE.YELLOW}
					</option>
					<option id={TRAFFIC_LIGHT_STATE.RED}>
						{TRAFFIC_LIGHT_STATE.RED}
					</option>
				</InputGroup>
			);
	};

	const renderComponentSpecificFields = () => {
		if (component instanceof IoTProgressBar)
			return (
				<>
					<InputGroup
						label="Minimum"
						value={component.getMin()}
						type="number"
						className="mb-2"
						onChange={(e: any) =>
							component.setRange(e.target.value, component.getMax())
						}
						disabled={!canEdit}
					/>
					<InputGroup
						label="Maximum"
						value={component.getMax()}
						type="number"
						className="mb-2"
						onChange={(e: any) =>
							component.setRange(component.getMin(), e.target.value)
						}
						disabled={!canEdit}
					/>
					<InputGroup
						label="Is Percentage"
						defaultChecked={component.isPercentage}
						type="checkbox"
						className="mb-2"
						onChange={(e: any) => {
							component.setIsPercentage(e.target.checked);
						}}
						disabled={!canEdit}
					/>
				</>
			);
		if (component instanceof IoTButton)
			return (
				<>
					<hr />
					<h3 className="text-2xl mt-2">On Click</h3>
					<InputGroup
						label="Targetted IoTObject"
						as="select"
						className="mb-2"
						onChange={(e: any) => component.setTargetId(e.target.value || null)}
						disabled={!canEdit}
						value={component.getTargetId() || ''}
					>
						<option></option>
						{iotObjects?.map((obj, idx) => (
							<option key={idx} value={obj.id}>
								{obj.name}
							</option>
						))}
					</InputGroup>
					<InputGroup
						label="Action id"
						className="mb-2"
						type="number"
						value={component.getActionId()}
						onChange={(e: any) => component.setActionId(e.target.value)}
						disabled={!canEdit}
					/>
					<InputGroup
						label="Action Data"
						as="textarea"
						className="mb-2"
						value={component.getActionData() || '{}'}
						onChange={(e: any) => component.setActionData(e.target.value)}
						disabled={!canEdit}
					/>
				</>
			);
		if (component instanceof IoTLabel)
			return (
				<InputGroup
					label="Font size"
					type="range"
					min={10}
					max={60}
					value={component.getFontSize()}
					className="mb-2"
					onChange={(e: any) => component.setFontSize(e.target.value)}
					disabled={!canEdit}
				/>
			);
		if (component instanceof IoTBuzzer)
			return (
				<>
					<InputGroup
						label="Sound Duration (seconds)"
						type="range"
						min={0.2}
						max={30}
						step={0.2}
						value={component.getSoundDuration()}
						className="mb-2"
						onChange={(e: any) => {
							component.setSoundDuration(e.target.value);
						}}
						disabled={!canEdit}
					/>
					<label style={{ fontSize: '1.2em' }}>
						{component.getSoundDuration()}s
					</label>
					<br />
					<InputGroup
						label="Frequency type"
						type="select"
						as="select"
						value={component.getFrequencyType()}
						className="mb-2"
						onChange={(e: any) => {
							component.setFrequencyType(e.target.value);
						}}
						disabled={!canEdit}
					>
						<option value="sine">Sine</option>
						<option value="sawtooth">Sawtooth</option>
						<option value="square">Square</option>
						<option value="triangle">Triangle</option>
					</InputGroup>
					<Button
						onClick={() => {
							component.isBuzzing() ? component.stopBuzz() : component.buzz();
						}}
						variant="third"
						className="mt-2"
					>
						{component.isBuzzing() ? 'Stop the sound' : 'Start the sound'}
					</Button>
				</>
			);
	};

	return (
		<div>
			<InputGroup
				label="name"
				value={component.name}
				className="mb-2"
				onChange={(e: any) => component.setName(e.target.value)}
				disabled={!canEdit}
			/>
			<InputGroup
				label="id"
				value={component.id}
				className="mb-2"
				onChange={(e: any) => component.setId(e.target.value)}
				disabled={!canEdit}
			/>
			<InputGroup
				label="Ref"
				as="select"
				value={component.isRef() ? component.value : 'static'}
				onChange={(e: any) => {
					console.log(e.target.value);
					if (e.target.value === 'static') component.reset();
					else component.setValue(e.target.value);
				}}
			>
				{renderDocumentEntries()}
			</InputGroup>
			{!component.isRef() && renderStaticValue()}
			{renderComponentSpecificFields()}
			<IoTGenericComponent component={component}></IoTGenericComponent>
			<Button
				disabled={!canEdit}
				variant="danger"
				onClick={() => setOpenDeleteMenu(true)}
			>
				Delete component
			</Button>
			<AlertConfirm
				title={`Deletion of component ${component.name}`}
				open={openDeleteMenu}
				setOpen={setOpenDeleteMenu}
				onConfirm={removeComponent}
				onCancel={() => setOpenDeleteMenu(false)}
			>
				Are you sure you want to delete the component {component.name} ?
			</AlertConfirm>
		</div>
	);
};

export default IoTComponentEditor;
