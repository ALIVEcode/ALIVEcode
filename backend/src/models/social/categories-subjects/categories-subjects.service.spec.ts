import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesSubjectsService } from './categories-subjects.service';

describe('CategoriesSubjectsService', () => {
  let service: CategoriesSubjectsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesSubjectsService],
    }).compile();

    service = module.get<CategoriesSubjectsService>(CategoriesSubjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
