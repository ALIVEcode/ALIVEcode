import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from '../../../user/entities/user.entity';
import { Quiz } from '../../quizzes/entities/quiz.entity';

@Entity()
export class Result {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => UserEntity, user => user.result, { eager: true })
  user: UserEntity;

  @ManyToOne(() => Quiz, quiz => quiz.results, { eager: true })
  @JoinColumn()
  quiz: Quiz;

  @Column({ type: 'int', default: 0 })
  percentage: number;
}

