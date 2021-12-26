import { Type } from "class-transformer";
import { CreatedByUser } from '../Generics/createdByUser.entity';
import { User } from '../User/user.entity';

export class AsScript extends CreatedByUser {
	@Type(() => User)
	creator: User;

	content: string;
}
