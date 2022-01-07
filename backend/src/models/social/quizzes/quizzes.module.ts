import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { Reward } from '../rewards/entities/reward.entity';
import { Question } from '../questions/entities/question.entity';
import { Result } from '../results/entities/result.entity';
import { CategoriesQuiz } from '../categories-quiz/entities/categories-quiz.entity';
import { Quiz } from './entities/quiz.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      Reward,
      Question,
      Result,
      CategoriesQuiz,
      Quiz

    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [QuizzesController],
  providers: [QuizzesService]
})
export class QuizzesModule {}
