import { Module } from '@nestjs/common';
import { ResultsService } from './results.service';
import { ResultsController } from './results.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { CategoriesQuiz } from '../categories-quiz/entities/categories-quiz.entity';
import { Question } from '../questions/entities/question.entity';
import { Quiz } from '../quizzes/entities/quiz.entity';
import { Reward } from '../rewards/entities/reward.entity';
import { Result } from './entities/result.entity';

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
  controllers: [ResultsController],
  providers: [ResultsService]
})
export class ResultsModule {}
