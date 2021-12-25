import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../../questions/entities/question.entity";

@Entity()
export class Answer {

    @PrimaryGeneratedColumn()
    id : number;

    @Column('varchar')
    value : string;

    @ManyToOne(() => Question, question => question.id_answer)
    @JoinColumn( { name : 'id_question' } )
    id_question : Question;

    @Column({ default: false})
    is_good: boolean;
}
