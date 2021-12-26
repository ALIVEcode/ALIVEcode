import { Question } from './question.entity';

export class Answer {
    id: string;
    value: string;
    is_good: string;
    question: {id: any}
}