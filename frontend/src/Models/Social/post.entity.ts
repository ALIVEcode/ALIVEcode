import { Type } from 'class-transformer';
import { User } from '../User/user.entity'
import { Subject } from "./subject.entity";
//ajouter le many to one avec le user 
export class Post{
    id : number;

    id_user : number;
    
    title : string;

    content : string;

    @Type(() => Date)
    created_at : Date;

    user_id: User;

    id_subject : Subject;




}

