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
import { prettyField } from '../../../../Types/formatting';
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
	}, [component?.type]);

	if (!component) {
		onClose();
		return <></>;
	}

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
					{t('iot.project.interface.components_form.ref.static')}
				</option>
				{getDocumentEntries(component).map((e, idx) => (
					<option key={idx} value={e.ref}>
						{e.ref} {'  (' + e.value.toString()}
						{')'}
					</option>
				))}
				{!component.isRefValueValid() && (
					<option value={component.value}>
						{component.value} (
						{t('iot.project.interface.components_form.ref.invalid')})
					</option>
				)}
			</>
		);
	};

	const renderStaticValue = () => {
		if (component instanceof IoTProgressBar)
			return (
				<InputGroup
					label={t(
						'iot.project.interface.components_form.progress.value.label',
					)}
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
					label={t('iot.project.interface.components_form.button.value.label')}
					placeholder={t(
						'iot.project.interface.components_form.button.value.placeholder',
					)}
					value={component.value}
					className="mb-2"
					onChange={(e: any) => component.setValue(e.target.value)}
					disabled={!canEdit}
				/>
			);
		if (component instanceof IoTLogs)
			return (
				<>
					<FormLabel>
						{t('iot.project.interface.components_form.logs.value.label')}
					</FormLabel>
					{component.value.length === 0 && (
						<>
							<br />
							<div className="mb-5">
								{t('iot.project.interface.components.logs.empty')}
								{canEdit && (
									<>
										,{' '}
										<Link onClick={() => component.addLog('New log')} dark>
											{t('iot.project.interface.components.logs.add')}
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
								{t('iot.project.interface.components.logs.add')}
							</Link>
							<br />
							<Button
								className="mt-2"
								onClick={() => component.clearLogs()}
								variant="danger"
								disabled={!canEdit}
							>
								{t('iot.project.interface.components.logs.clear')}
							</Button>
						</>
					)}
				</>
			);
		if (component instanceof IoTLed)
			return (
				<InputGroup
					label={t('iot.project.interface.components_form.led.value.label')}
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
					label={t('iot.project.interface.components_form.label.value.label')}
					placeholder={t(
						'iot.project.interface.components_form.label.value.placeholder',
					)}
					value={component.value}
					className="mb-2"
					onChange={(e: any) => component.setValue(e.target.value)}
					disabled={!canEdit}
				/>
			);
		if (component instanceof IoTBuzzer)
			return (
				<InputGroup
					label={t('iot.project.interface.components_form.buzzer.value.label')}
					placeholder={t(
						'iot.project.interface.components_form.buzzer.value.placeholder',
					)}
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
					label={t(
						'iot.project.interface.components_form.traffic_light.value.label',
					)}
					placeholder={t(
						'iot.project.interface.components_form.traffic_light.value.placeholder',
					)}
					value={component.value}
					as="select"
					defaultChecked={component.value}
					className="mb-2"
					onChange={(e: any) => component.setValue(e.target.value)}
					disabled={!canEdit}
				>
					{Object.entries(TRAFFIC_LIGHT_STATE).map((entry, idx) => (
						<option key={idx} value={entry[1]}>
							{prettyField(
								t(
									`iot.project.interface.components.traffic_light.${entry[0].toLowerCase()}`,
								),
							)}
						</option>
					))}
				</InputGroup>
			);
	};

	const renderComponentSpecificFields = () => {
		if (component instanceof IoTProgressBar)
			return (
				<>
					<InputGroup
						label={t(
							'iot.project.interface.components_form.progress.min.label',
						)}
						placeholder={t(
							'iot.project.interface.components_form.progress.min.placeholder',
						)}
						value={component.getMin()}
						type="number"
						className="mb-2"
						onChange={(e: any) =>
							component.setRange(e.target.value, component.getMax())
						}
						disabled={!canEdit}
					/>
					<InputGroup
						label={t(
							'iot.project.interface.components_form.progress.max.label',
						)}
						placeholder={t(
							'iot.project.interface.components_form.progress.max.placeholder',
						)}
						value={component.getMax()}
						type="number"
						className="mb-2"
						onChange={(e: any) =>
							component.setRange(component.getMin(), e.target.value)
						}
						disabled={!canEdit}
					/>
					<InputGroup
						label={t(
							'iot.project.interface.components_form.progress.is_percentage.label',
						)}
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
					<h3 className="text-2xl mt-6 mb-2">
						{t('iot.project.interface.components_form.button.on_click')}
					</h3>
					<InputGroup
						label={t(
							'iot.project.interface.components_form.button.target.label',
						)}
						placeholder={t(
							'iot.project.interface.components_form.button.target.placeholder',
						)}
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
						label={t(
							'iot.project.interface.components_form.button.action_id.label',
						)}
						placeholder={t(
							'iot.project.interface.components_form.button.action_id.placeholder',
						)}
						className="mb-2"
						type="number"
						value={component.getActionId()}
						onChange={(e: any) => component.setActionId(e.target.value)}
						disabled={!canEdit}
					/>
					<InputGroup
						label={t(
							'iot.project.interface.components_form.button.action_data.label',
						)}
						placeholder={t(
							'iot.project.interface.components_form.button.action_data.placeholder',
						)}
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
					label={t(
						'iot.project.interface.components_form.label.font_size.label',
					)}
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
						label={t(
							'iot.project.interface.components_form.buzzer.duration.label',
						)}
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
						label={t(
							'iot.project.interface.components_form.buzzer.frequency_type.label',
						)}
						placeholder={t(
							'iot.project.interface.components_form.buzzer.frequency_type.placeholder',
						)}
						type="select"
						as="select"
						value={component.getFrequencyType()}
						className="mb-2"
						onChange={(e: any) => {
							component.setFrequencyType(e.target.value);
						}}
						disabled={!canEdit}
					>
						<option value="sine">
							{t('iot.project.interface.components.buzzer.sine')}
						</option>
						<option value="sawtooth">
							{t('iot.project.interface.components.buzzer.sawtooth')}
						</option>
						<option value="square">
							{t('iot.project.interface.components.buzzer.square')}
						</option>
						<option value="triangle">
							{t('iot.project.interface.components.buzzer.triangle')}
						</option>
					</InputGroup>
					<Button
						onClick={() => {
							component.isBuzzing() ? component.stopBuzz() : component.buzz();
						}}
						variant="third"
						className="mt-2"
					>
						{component.isBuzzing()
							? t('iot.project.interface.components.buzzer.stop')
							: t('iot.project.interface.components.buzzer.start')}
					</Button>
				</>
			);
	};

	return (
		<div>
			<InputGroup
				label={t('iot.project.interface.components_form.name.label')}
				placeholder={t(
					'iot.project.interface.components_form.name.placeholder',
				)}
				value={component.name}
				className="mb-2"
				onChange={(e: any) => component.setName(e.target.value)}
				disabled={!canEdit}
			/>
			<InputGroup
				label={t('iot.project.interface.components_form.id.label')}
				placeholder={t('iot.project.interface.components_form.id.placeholder')}
				value={component.id}
				className="mb-2"
				onChange={(e: any) => component.setId(e.target.value)}
				disabled={!canEdit}
			/>
			<InputGroup
				label={t('iot.project.interface.components_form.ref.label')}
				as="select"
				errors={
					!component.isRefValueValid() ? [{ type: 'Invalid ref' }] : undefined
				}
				value={component.isRef() ? component.value : 'static'}
				onChange={(e: any) => {
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
				{t('iot.project.interface.delete_component')}
			</Button>
			<AlertConfirm
				title={`Deletion of component ${component.name}`}
				open={openDeleteMenu}
				setOpen={setOpenDeleteMenu}
				onConfirm={removeComponent}
				onCancel={() => setOpenDeleteMenu(false)}
			>
				<div className="mb-2">
					{t('iot.project.interface.delete_component_confirm')} "
					<i>{component.name}</i>"?
					<div className="font-semibold text-[color:var(--danger-color)]">
						{t('action.irreversible')}
					</div>
				</div>
			</AlertConfirm>
		</div>
	);
};

export default IoTComponentEditor;
