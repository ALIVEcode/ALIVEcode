import { Type } from 'class-transformer';
import { IoTProject } from '../../Iot/IoTproject.entity';
import { Challenge } from '../challenge.entity';

export enum IOT_CHALLENGE_TYPE {
	SCRIPTING = 'SC',
	UPDATING = 'UP',
}

export class ChallengeIoT extends Challenge {
	@Type(() => IoTProject)
	project?: IoTProject;

	project_id: string;

	initialCode?: string;

	solution?: string;

	iotType: IOT_CHALLENGE_TYPE;
}
