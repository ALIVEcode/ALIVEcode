import { Module, UseInterceptors } from '@nestjs/common';
import { FeedbacksService } from './feedbacks.service';
import { FeedbacksController } from './feedbacks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { FeedbackEntity } from './entities/feedback.entity';
import { DTOInterceptor } from '../../utils/interceptors/dto.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([FeedbackEntity, UserEntity])],
  controllers: [FeedbacksController],
  providers: [FeedbacksService],
})
export class FeedbacksModule {}
