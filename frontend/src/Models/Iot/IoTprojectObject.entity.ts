import { Exclude, Type } from 'class-transformer';
import { IoTObject } from './IoTobject.entity';
import { IoTProject } from './IoTproject.entity';
import { IoTScript } from './IoTscript.entity';

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

	@Type(() => IoTScript)
	iotScript?: IoTScript;

	iotScriptId?: string;

	private currentTarget: PROJECT_OBJECT_TARGET;

	get target() {
		if (this.currentTarget === PROJECT_OBJECT_TARGET.OBJECT)
			return this.iotObject;
		return this.iotTestObject;
	}
}
