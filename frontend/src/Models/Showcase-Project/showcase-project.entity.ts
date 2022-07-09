import { Type } from 'class-transformer';
import { SUBJECTS } from '../../Types/sharedTypes';

export class ShowcaseProject {
	name: string;

	description: string;

	subject: SUBJECTS;

	contributors: string[];

	imgSrc?: string;

	videoUrl?: string;

	learnMoreUrl?: string;

	@Type(() => Date)
	startDate: Date;

	@Type(() => Date)
	finishDate?: Date;
}
