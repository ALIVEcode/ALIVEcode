import { Type } from 'class-transformer';
import { CreatedByUser } from '../Generics/createdByUser.entity';
import { User } from '../User/user.entity';

export class AsScript extends CreatedByUser {
	@Type(() => User)
	creator: User;

	content: string;

	constructor(name: string, content: string, creator: User) {
		super(name);
		this.creator = creator;
		this.content = content;
	}
}
