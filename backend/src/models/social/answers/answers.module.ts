import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from './answers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  exports: [TypeOrmModule],
  controllers: [AnswersController],
  providers: [AnswersService]
})
export class AnswersModule {}
