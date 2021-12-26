import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CategoriesSubject } from "../../categories-subjects/entities/categories-subject.entity";
import { Post } from "../../post/entities/post.entity";

@Entity()
export class Subject {
    @PrimaryGeneratedColumn()
    id : number;

    @Column('varchar')
    name : string;

    @OneToMany(() => Post, post => post.subject, { eager: true })
    posts: Post[];

    @ManyToOne(() => CategoriesSubject, category => category.subjects)
    @JoinColumn()
    category : CategoriesSubject;
}
