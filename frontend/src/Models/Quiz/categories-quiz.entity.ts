import { Quiz } from "./quiz.entity";

export class Category {
	id: number;
	name: string;
	quizzes: [Quiz];
}