import { Type, Exclude } from 'class-transformer';
import { CreatedByUser } from '../Generics/createdByUser.entity';
import { User } from '../User/user.entity';
import { IoTProject } from './IoTproject.entity';
import { IOT_EVENT } from './IoTProjectClasses/IoTTypes';

export class IoTLog {
	public date: Date;
	public event: IOT_EVENT;
	public text: string;
}
export class IoTObject extends CreatedByUser {
	@Type(() => User)
	creator: User;

	@Type(() => IoTProject)
	currentIotProject?: IoTProject;

	currentIoTProjectId?: string;

	@Exclude({ toPlainOnly: true })
	@Type(() => IoTLog)
	logs: IoTLog[];
}
