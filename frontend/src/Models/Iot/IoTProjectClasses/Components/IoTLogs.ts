import { Exclude } from 'class-transformer';
import { isDate } from 'moment';
import { isArray } from 'tone';
import { IoTComponent, IOT_COMPONENT_TYPE } from '../IoTComponent';
import { TFunction } from 'i18next';

export type IoTLogModel = {
	date: Date;
	text: string;
};

export type IoTLogsModel = Array<IoTLogModel>;

@Exclude()
export class IoTLogs extends IoTComponent {
	public defaultValue: IoTLogsModel = [];
	public value: IoTLogsModel = [];

	public type = IOT_COMPONENT_TYPE.LOGS;

	public validate(val: any) {
		return (
			isArray(val) &&
			val.every(v => 'date' in v && isDate(v.date) && 'text' in v)
		);
	}

	update(data: any): void {
		this.addLog(String(data));
	}

	updateLog(log: IoTLogModel, updatedLog: IoTLogModel) {
		this.value = this.value.map(l => (l === log ? updatedLog : l));

		this.getComponentManager()?.render();
	}

	addLog(text: string) {
		this.value.push({
			text,
			date: new Date(),
		});
		this.getComponentManager()?.render();
	}

	clearLogs() {
		this.value = [];
		this.getComponentManager()?.render();
	}
}

export const createDefaultIoTLogs = (t: TFunction) => {
	const logs = new IoTLogs();
	logs.value = [
		{
			date: new Date(Date.now() - 1000 * 60 * 60 * 5),
			text: 'This a log submitted 5 hours ago',
		},
		{
			date: new Date(),
			text: 'This a log example',
		},
	];
	logs.name = t('iot.project.interface.components.logs.name');
	logs.id = '';

	return logs;
};
