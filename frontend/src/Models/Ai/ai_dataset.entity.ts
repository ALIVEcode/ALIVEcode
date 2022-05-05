import { Type } from 'class-transformer';

export class AIDataset {
	id: string;

	name: string;

	data: object;

	@Type(() => Date)
	createDate: Date;

	@Type(() => Date)
	updateDate: Date;
}
