import { UserEntity } from "src/models/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { CategoriesSubject } from "../../categories-subjects/entities/categories-subject.entity";
import { Subject } from "../../subjects/entities/subject.entity";
//ajouter le many to one avec le user 
@Entity()
export class Post{
    @PrimaryGeneratedColumn()
    id : number;

    @Column('int')
    id_user : number;
    
    @Column('varchar')
    title : string;

    @Column('text')
    content : string;

    @Column('varchar')
    created_at : Timestamp;

    @ManyToOne(() => UserEntity, user => user.post)
    @JoinColumn( { name : 'id_user' } )
    user_id: UserEntity;

    @ManyToOne(() => Subject, subject => subject.posts)
    @JoinColumn( { name : 'id_subject' } )
    id_subject : Subject;

    @OneToOne(() => CategoriesSubject)
    @JoinColumn( { name : 'id_category' } )
    id_category : CategoriesSubject;


}

