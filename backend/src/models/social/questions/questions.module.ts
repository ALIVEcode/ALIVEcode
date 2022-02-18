import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Question,
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [QuestionsController],
  providers: [QuestionsService]
})
export class QuestionsModule {}
