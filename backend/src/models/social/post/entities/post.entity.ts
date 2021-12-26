import { IsNotEmpty } from "class-validator";
import { UserEntity } from "src/models/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { CommentairesForum } from "../../commentaires-forum/entities/commentaires-forum.entity";
import { Subject } from "../../subjects/entities/subject.entity";

@Entity()
export class Post{
    @ManyToOne(() => UserEntity, user => user.post, { eager: true })
    @JoinColumn()
    @IsNotEmpty()
    creator: UserEntity;

    @PrimaryGeneratedColumn()
    id : number;
    
    @Column('varchar')
    @IsNotEmpty()
    title : string;

    @Column('text')
    @IsNotEmpty()
    content : string;

    @Column('varchar')
    @IsNotEmpty()
    created_at : Timestamp;

    @ManyToOne(() => Subject, subject => subject.posts)
    @JoinColumn()
    @IsNotEmpty()
    subject : Subject;

    @OneToMany(() => CommentairesForum, comment => comment.post, { eager: true })
    comments: CommentairesForum[];

}

