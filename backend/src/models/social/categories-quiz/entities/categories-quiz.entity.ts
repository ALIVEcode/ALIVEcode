import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Quiz } from "../../quizzes/entities/quiz.entity";

@Entity()
export class CategoriesQuiz {

    @PrimaryGeneratedColumn()
    id : number;

    @OneToMany(() => Quiz, quiz => quiz.category)
    quiz : Quiz;

    @Column('varchar')
    name : string;
}
