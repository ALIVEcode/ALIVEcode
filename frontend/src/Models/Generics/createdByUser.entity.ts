import { Exclude, Type } from 'class-transformer';
import { User } from '../User/user.entity';

export abstract class CreatedByUser {
	constructor(name: string) {
		this.name = name;
	}

	@Exclude({ toPlainOnly: true })
	id: string;

	name: string;

	abstract creator: User | undefined;

	@Exclude({ toPlainOnly: true })
	@Type(() => Date)
	creationDate: Date;

	@Exclude({ toPlainOnly: true })
	@Type(() => Date)
	updateDate: Date;

	description?: string;
}
