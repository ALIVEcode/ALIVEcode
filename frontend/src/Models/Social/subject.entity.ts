import { CategoriesSubject } from "./categories-subject.entity";
import { Post } from "./post.entity";

export class Subject {
    id : number;

    name : string;

    posts: Post[];

    id_category : CategoriesSubject;
}
