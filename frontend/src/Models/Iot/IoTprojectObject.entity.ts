import { Exclude, Type } from 'class-transformer';
import { IoTObject } from './IoTobject.entity';
import { IoTProject } from './IoTproject.entity';
import { AsScript } from '../AsScript/as-script.entity';
import AliotASExecutor from '../../Pages/Challenge/ChallengeIoT/AliotASExecutor';
import { IoTSocket } from './IoTProjectClasses/IoTSocket';
import { AlertManager } from 'react-alert';

export enum PROJECT_OBJECT_TARGET {
	OBJECT = 'O',
	TEST = 'T',
}
export class IoTProjectObject {
	@Exclude({ toPlainOnly: true })
	id: number;

	@Type(() => IoTProject)
	iotProject: IoTProject;

	@Type(() => IoTObject)
	iotObject: IoTObject;

	@Type(() => IoTObject)
	iotTestObject?: IoTObject;

	@Type(() => AsScript)
	script?: AsScript;

	scriptId?: string;

	private currentTarget: PROJECT_OBJECT_TARGET;

	get target() {
		if (this.currentTarget === PROJECT_OBJECT_TARGET.OBJECT)
			return this.iotObject;
		return this.iotTestObject;
	}

	executor?: AliotASExecutor;

	hasExecutor() {
		return this.executor != null;
	}

	initializeExecutor(socket: IoTSocket, alert?: AlertManager) {
		if (!this.target) throw new Error('No target set for execution');
		const object = this.target;
		this.executor = new AliotASExecutor(
			object.id.toString(),
			() => {},
			socket,
			'fr',
			object.id,
			alert
		);
	}
}
