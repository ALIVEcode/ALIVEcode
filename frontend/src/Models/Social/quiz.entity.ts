import { User } from '../User/user.entity';
import { CategoriesQuiz } from './categories-quiz.entity';
import { Question } from './question.entity';
import { Result } from './result.entity';
import { Reward } from './reward.entity';


export class Quiz {
 
    id : number;


    name : string;

    user_id: User;


    reward : Reward;


    questions: Question[];

    results: Result[];

    category: CategoriesQuiz;
    
   


}
