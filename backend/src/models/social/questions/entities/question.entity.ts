import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Answer } from "../../answers/entities/answer.entity";
import { Quiz } from "../../quizzes/entities/quiz.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn()
    id : number;

    @Column('varchar')
    name : string;

    @ManyToOne(() => Quiz, quiz => quiz.questions, { eager: true})
    @JoinColumn()
    quiz : Quiz;

    @OneToMany(() => Answer, answer => answer.id_question)
    id_answer : Answer[];
}
