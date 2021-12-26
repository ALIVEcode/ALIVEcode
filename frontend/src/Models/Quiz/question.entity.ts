import { Quiz } from "./quiz.entity";
import { Answer } from './answer.entity';

export class Question {
    id: string;
    name: string;
    quiz: Quiz;
    answers: [Answer]
}