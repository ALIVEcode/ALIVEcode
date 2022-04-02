import { Exclude } from 'class-transformer';
import { IoTProject } from './IoTproject.entity';
import { IoTProjectObject } from './IoTprojectObject.entity';

export class IoTScript {
	@Exclude({ toPlainOnly: true })
	id: number;

	name: string;

	iotProject: IoTProject;

	iotProjectObject?: IoTProjectObject;
}
