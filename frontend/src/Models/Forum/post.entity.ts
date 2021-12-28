import { CreatedByUser } from "../Generics/createdByUser.entity";
import { User } from "../User/user.entity";
import { Comment } from "./comment.entity";

export class Post extends CreatedByUser {
    creator: User;

    id: string;

    title: string;

    created_at: string;
    
    content: string;

    subject: {
        id: number;
    };

    comments: Comment[];

}