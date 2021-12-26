import { Exclude } from 'class-transformer';
import { IoTComponent, IOT_COMPONENT_TYPE } from '../IoTComponent';

export type IoTLogModel = {
	date: Date;
	text: string;
};

export type IoTLogsModel = Array<IoTLogModel>;

@Exclude()
export class IoTLogs extends IoTComponent {
	public value: IoTLogsModel = [];

	public type = IOT_COMPONENT_TYPE.LOGS;

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

export const createDefaultIoTLogs = () => {
	const progress = new IoTLogs();
	progress.value = [
		{
			date: new Date(Date.now() - 1000 * 60 * 60 * 5),
			text: 'This a log submitted 5 hours ago',
		},
		{
			date: new Date(),
			text: 'This a log example',
		},
	];
	progress.name = 'Default Logs';
	progress.id = '';

	return progress;
};