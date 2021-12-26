import { Question } from "./question.entity";

export class Quiz {
	id: number;
	name: string;
	description: string;
	questions: Question[];
	category: {
		id: number;
		name: string;
	};
}