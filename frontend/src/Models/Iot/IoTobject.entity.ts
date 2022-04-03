import { Type } from 'class-transformer';
import { CreatedByUser } from '../Generics/createdByUser.entity';
import { User } from '../User/user.entity';
import { IoTProject } from './IoTproject.entity';

export class IoTObject extends CreatedByUser {
	@Type(() => User)
	creator: User;

	@Type(() => IoTProject)
	currentIotProject?: IoTProject;

	currentIoTProjectId?: string;
}
