import { IsNotEmpty } from "class-validator";
import { UserEntity } from 'src/models/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CategoriesQuiz } from '../../categories-quiz/entities/categories-quiz.entity';
import { Question } from '../../questions/entities/question.entity';
import { Result } from '../../results/entities/result.entity';
import { Reward } from '../../rewards/entities/reward.entity';

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  @IsNotEmpty()
  name: string;

  @Column('text')
  @IsNotEmpty()
  description: string;

  // TODO: change to @creator or smtg idk
  @ManyToOne(() => UserEntity, user => user.quiz)
  @JoinColumn()
  user: UserEntity;

  @OneToOne(() => Reward, { eager: true })
  @JoinColumn()
  reward: Reward;

  @OneToMany(() => Question, question => question.quiz, { eager: true, cascade: true })
  @JoinColumn()
  questions: Question[];

  @OneToMany(() => Result, result => result.quiz)
  @JoinColumn()
  results: Result[];

  @ManyToOne(() => CategoriesQuiz, category => category.id, { eager: true })
  @JoinColumn()
  @IsNotEmpty()
  category: CategoriesQuiz;
}
