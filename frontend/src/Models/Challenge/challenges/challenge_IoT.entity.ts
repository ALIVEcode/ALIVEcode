import { Type } from 'class-transformer';
import { IoTProject } from '../../Iot/IoTproject.entity';
import { Challenge } from '../challenge.entity';

export class ChallengeIoT extends Challenge {
	@Type(() => IoTProject)
	project?: IoTProject;

	project_id: string;
}
