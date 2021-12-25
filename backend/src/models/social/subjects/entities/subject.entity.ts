import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CategoriesSubject } from "../../categories-subjects/entities/categories-subject.entity";
import { Post } from "../../post/entities/post.entity";

@Entity()
export class Subject {
    @PrimaryGeneratedColumn()
    id : number;

    @Column('varchar')
    name : string;

    @OneToMany(() => Post, post => post.id_subject)
    posts: Post[];

    @ManyToOne(() => CategoriesSubject, category => category.subjects)
    @JoinColumn( { name : 'id_category' } )
    id_category : CategoriesSubject;
}
