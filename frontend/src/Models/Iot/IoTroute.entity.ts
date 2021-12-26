import { Exclude, Type } from 'class-transformer';
import { AsScript } from '../AsScript/as-script.entity';
import { IoTProject } from './IoTproject.entity';

export class IotRoute {
	@Exclude({ toPlainOnly: true })
	id: string;

	name: string;

	path: string;

	project: IoTProject;

	@Type(() => AsScript)
	asScript?: AsScript;
}
