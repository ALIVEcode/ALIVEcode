import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Answer,
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [AnswersController],
  providers: [AnswersService]
})
export class AnswersModule {}
