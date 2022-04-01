import { CreatedByUser } from '../Generics/createdByUser.entity';
import { User } from '../User/user.entity';

export class IoTObject extends CreatedByUser {
	creator: User;
}
