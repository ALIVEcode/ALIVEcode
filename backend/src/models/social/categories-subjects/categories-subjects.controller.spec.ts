import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesSubjectsController } from './categories-subjects.controller';
import { CategoriesSubjectsService } from './categories-subjects.service';

describe('CategoriesSubjectsController', () => {
  let controller: CategoriesSubjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesSubjectsController],
      providers: [CategoriesSubjectsService],
    }).compile();

    controller = module.get<CategoriesSubjectsController>(CategoriesSubjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
