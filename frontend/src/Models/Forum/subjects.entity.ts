import { Post } from "./post.entity";

export class Subject {
    id: number;

    name: string;

    posts: Post[];
}