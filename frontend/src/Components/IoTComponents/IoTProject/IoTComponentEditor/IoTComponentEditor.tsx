import { Col, Form, Row } from 'react-bootstrap';
import { IoTComponentEditorProps } from './iotComponentEditorTypes';
import { IoTProgressBar } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTProgressBar';
import IoTGenericComponent from '../../IoTProjectComponents/IoTGenericComponent/IoTGenericComponent';
import { IoTButton } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTButton';
import { IoTLogs } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLogs';
import Button from '../../../UtilsComponents/Button/Button';
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
import {
	IoTLed,
	LED_STATE,
} from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLed';
import { IoTLabel } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTLabel';
import { IoTBuzzer } from '../../../../Models/Iot/IoTProjectClasses/Components/IoTBuzzer';

const IoTComponentEditor = ({
	component,
	onClose,
}: IoTComponentEditorProps) => {
	const [openDeleteMenu, setOpenDeleteMenu] = useState(false);
	const [iotObjects, setIoTObjects] = useState<IoTObject[]>();
	const alert = useAlert();
	const { t } = useTranslation();
	const { canEdit } = useContext(IoTProjectContext);

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

	const renderComponentSpecificFields = () => {
		if (component instanceof IoTProgressBar)
			return (
				<>
					<Form.Label>Value</Form.Label>
					<Form.Control
						type="range"
						min={component.getMin()}
						max={component.getMax()}
						value={component.value}
						className="mb-2"
						onChange={(e: any) => component.setValue(e.target.value)}
						disabled={!canEdit}
					/>
					<Form.Label>Minimum</Form.Label>
					<Form.Control
						value={component.getMin()}
						type="number"
						className="mb-2"
						onChange={(e: any) =>
							component.setRange(e.target.value, component.getMax())
						}
						disabled={!canEdit}
					/>
					<Form.Label>Maximum</Form.Label>
					<Form.Control
						value={component.getMax()}
						type="number"
						className="mb-2"
						onChange={(e: any) =>
							component.setRange(component.getMin(), e.target.value)
						}
						disabled={!canEdit}
					/>
					<Form.Label>Is percentage</Form.Label>
					<Form.Check
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
					<Form.Label>Value (Label)</Form.Label>
					<Form.Control
						value={component.value}
						className="mb-2"
						onChange={(e: any) => component.setValue(e.target.value)}
						disabled={!canEdit}
					/>
					<hr />
					<h3>On Click</h3>
					<Form.Label>Targetted IoTObject</Form.Label>
					<Form.Control
						as="select"
						className="mb-2"
						onChange={(e: any) => component.setTargetId(e.target.value || null)}
						disabled={!canEdit}
						value={component.getTargetId() || ''}
					>
						<option></option>
						{iotObjects?.map(obj => (
							<option value={obj.id}>{obj.name}</option>
						))}
					</Form.Control>
					<Form.Label>Action id</Form.Label>
					<Form.Control
						className="mb-2"
						type="number"
						value={component.getActionId()}
						onChange={(e: any) => component.setActionId(e.target.value)}
						disabled={!canEdit}
					/>
					<Form.Label>Action Data</Form.Label>
					<Form.Control
						as="textarea"
						className="mb-2"
						value={component.getActionData() || '{}'}
						onChange={(e: any) => component.setActionData(e.target.value)}
						disabled={!canEdit}
					/>
				</>
			);
		if (component instanceof IoTLogs)
			return (
				<>
					<Form.Label>Logs</Form.Label>
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
					{component.value.map(log => (
						<Row>
							<Col>
								<Form.Control
									as="textarea"
									className="mb-2"
									value={log.text}
									onChange={(e: any) =>
										component.updateLog(log, { ...log, text: e.target.value })
									}
									disabled={!canEdit}
								/>
							</Col>
							<Col>
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
							</Col>
						</Row>
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
				<>
					<Form.Label>LED on/off</Form.Label>
					<Form.Check
						type="checkbox"
						defaultChecked={component.value === LED_STATE.ON}
						className="mb-2"
						onChange={(e: any) => component.setValue(e.target.checked)}
						disabled={!canEdit}
					/>
				</>
			);
		if (component instanceof IoTLabel)
			return (
				<>
					<Form.Label>Displayed Text</Form.Label>
					<Form.Control
						value={component.value}
						className="mb-2"
						onChange={(e: any) => component.setValue(e.target.value)}
						disabled={!canEdit}
					/>
					<Form.Label>Font size</Form.Label>
					<Form.Control
						type="range"
						min={10}
						max={60}
						value={component.getFontSize()}
						className="mb-2"
						onChange={(e: any) => component.setFontSize(e.target.value)}
						disabled={!canEdit}
					/>
				</>
			);
		if (component instanceof IoTBuzzer)
			return (
				<>
					<Form.Label>Frequency</Form.Label>
					<Form.Control
						type="number"
						min={0}
						max={10000}
						value={component.value}
						className="mb-2"
						onChange={(e: any) => component.setValue(e.target.value)}
						disabled={!canEdit}
					/>
					<Form.Label>Sound Duration (seconds)</Form.Label>
					<Form.Control
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
					<Form.Label className="mt-2">Frequency type</Form.Label>
					<Form.Control
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
					</Form.Control>
					<Button
						onClick={() => {
							component.isBuzzing() ? component.stopBuzz() : component.buzz();
						}}
						variant="primary"
						className="mt-2"
					>
						{component.isBuzzing() ? 'Stop the sound' : 'Start the sound'}
					</Button>
				</>
			);
	};

	return (
		<div>
			<Form.Label>Name</Form.Label>
			<Form.Control
				value={component.name}
				className="mb-2"
				onChange={(e: any) => component.setName(e.target.value)}
				disabled={!canEdit}
			/>
			<Form.Label>Id</Form.Label>
			<Form.Control
				value={component.id}
				className="mb-2"
				onChange={(e: any) => component.setId(e.target.value)}
				disabled={!canEdit}
			/>
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
				onClose={() => setOpenDeleteMenu(false)}
				onConfirm={removeComponent}
				onCancel={() => setOpenDeleteMenu(false)}
			>
				Are you sure you want to delete the component {component.name} ?
			</AlertConfirm>
		</div>
	);
};

export default IoTComponentEditor;