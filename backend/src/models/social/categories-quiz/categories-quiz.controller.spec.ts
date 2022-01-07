import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesQuizController } from './categories-quiz.controller';
import { CategoriesQuizService } from './categories-quiz.service';

describe('CategoriesQuizController', () => {
  let controller: CategoriesQuizController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesQuizController],
      providers: [CategoriesQuizService],
    }).compile();

    controller = module.get<CategoriesQuizController>(CategoriesQuizController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
