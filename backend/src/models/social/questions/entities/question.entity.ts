import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Answer } from "../../answers/entities/answer.entity";
import { Quiz } from "../../quizzes/entities/quiz.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id : number;

    @Column('varchar')
    @IsNotEmpty()
    name : string;

    @ManyToOne(() => Quiz, quiz => quiz.questions, {onDelete: 'CASCADE'})
    @JoinColumn()
    @IsNotEmpty()
    quiz : Quiz;

    @OneToMany(() => Answer, answer => answer.question, {eager: true, cascade: true})
    answers : Answer[];
}
