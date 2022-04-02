import { Exclude } from 'class-transformer';
import { IoTObject } from './IoTobject.entity';
import { IoTProject } from './IoTproject.entity';
import { IoTScript } from './IoTscript.entity';

export class IoTProjectObject {
	@Exclude({ toPlainOnly: true })
	id: number;

	iotProject: IoTProject;

	iotObject?: IoTObject;

	iotTestObject?: IoTObject;

	iotScript?: IoTScript;
}
