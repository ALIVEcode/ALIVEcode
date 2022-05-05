import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIModelEntity } from './entities/ai_model.entity';
import { AIDatasetEntity } from './entities/ai_dataset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AIModelEntity, AIDatasetEntity])],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
