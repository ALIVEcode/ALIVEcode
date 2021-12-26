import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { Topics } from './entities/topics.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Topics

    ]),
  ],
  controllers: [TopicsController],
  providers: [TopicsService]
})
export class TopicsModule {}
