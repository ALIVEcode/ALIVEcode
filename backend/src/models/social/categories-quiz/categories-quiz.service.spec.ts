import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesQuizService } from './categories-quiz.service';

describe('CategoriesQuizService', () => {
  let service: CategoriesQuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesQuizService],
    }).compile();

    service = module.get<CategoriesQuizService>(CategoriesQuizService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
