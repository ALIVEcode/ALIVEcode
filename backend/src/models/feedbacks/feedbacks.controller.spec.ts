import { Test, TestingModule } from '@nestjs/testing';
import { FeedbacksController } from './feedbacks.controller';
import { FeedbacksService } from './feedbacks.service';

describe('FeedbacksController', () => {
  let controller: FeedbacksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbacksController],
      providers: [FeedbacksService],
    }).compile();

    controller = module.get<FeedbacksController>(FeedbacksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
