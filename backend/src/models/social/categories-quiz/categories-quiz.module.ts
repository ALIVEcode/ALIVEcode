import { Module } from '@nestjs/common';
import { CategoriesQuizService } from './categories-quiz.service';
import { CategoriesQuizController } from './categories-quiz.controller';

@Module({
  controllers: [CategoriesQuizController],
  providers: [CategoriesQuizService]
})
export class CategoriesQuizModule {}
