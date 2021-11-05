import { UserEntity } from "src/models/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { Subject } from "../../subjects/entities/subject.entity";
//ajouter le many to one avec le user 
@Entity()
export class Post{
    @PrimaryGeneratedColumn()
    id : number;
    
    @Column('varchar')
    title : string;

    @Column('text')
    content : string;

    @Column('varchar')
    created_at : Timestamp;

    @ManyToOne(() => UserEntity, user => user.post, { eager: true })
    @JoinColumn()
    user: UserEntity;

    @ManyToOne(() => Subject, subject => subject.posts)
    @JoinColumn()
    subject : Subject;




}

