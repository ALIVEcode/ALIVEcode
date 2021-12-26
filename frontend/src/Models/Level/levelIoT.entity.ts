import { Type } from "class-transformer";
import { IoTProject } from "../Iot/IoTproject.entity";
import { Level } from './level.entity';

export enum IOT_LEVEL_TYPE {
	SCRIPTING = 'SC',
	UPDATING = 'UP',
}

export class LevelIoT extends Level {
	@Type(() => IoTProject)
	project?: IoTProject;

	project_id: string;

	initialCode?: string;

	solution?: string;

	iotType: IOT_LEVEL_TYPE;
}
