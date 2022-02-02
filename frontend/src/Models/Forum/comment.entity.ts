import { CreatedByUser } from "../Generics/createdByUser.entity";
import { User } from "../User/user.entity";
import { Post } from "./post.entity";

export class Comment extends CreatedByUser {
    creator: User;

    id: string;
    
    content: string;

    created_at: string;

    post: Post;

}

