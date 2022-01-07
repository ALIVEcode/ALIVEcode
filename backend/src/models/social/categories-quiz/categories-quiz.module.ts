import { Module } from '@nestjs/common';
import { CategoriesQuizService } from './categories-quiz.service';
import { CategoriesQuizController } from './categories-quiz.controller';
import { CategoriesQuiz } from '../categories-quiz/entities/categories-quiz.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategoriesQuiz,
    ]),
  ],
  controllers: [CategoriesQuizController],
  providers: [CategoriesQuizService],
})
export class CategoriesQuizModule {}
