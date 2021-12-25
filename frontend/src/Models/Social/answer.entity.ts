import { Question } from "./question.entity";

export class Answer {

    id : number;

    value : string;


    id_question : Question;

    is_good: boolean;
}
