import { IsNotEmpty } from "class-validator";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Quiz } from "../../quizzes/entities/quiz.entity";

@Entity()
export class CategoriesQuiz {

    @PrimaryGeneratedColumn()
    id : number;

    @OneToMany(() => Quiz, quiz => quiz.category)
    quizzes : Quiz[];

    @Column('varchar')
    @IsNotEmpty()
    name : string;
}
