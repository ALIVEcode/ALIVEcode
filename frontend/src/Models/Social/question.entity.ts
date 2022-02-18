import { Answer } from "./answer.entity";
import { Quiz } from "./quiz.entity";

export class Question {

    id : number;

    name : string;

    quiz : Quiz;

    id_answer : Answer[];
}
