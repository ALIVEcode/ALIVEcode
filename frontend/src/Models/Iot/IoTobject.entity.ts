import { CreatedByUser } from '../Generics/createdByUser.entity';
import { User } from '../User/user.entity';
import { IoTProject } from './IoTproject.entity';

export class IoTObject extends CreatedByUser {
	creator: User;
	currentIotProject: IoTProject;
}
