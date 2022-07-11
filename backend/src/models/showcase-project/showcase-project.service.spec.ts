import { Test, TestingModule } from '@nestjs/testing';
import { ShowcaseProjectService } from './showcase-project.service';

describe('ShowcaseProjectService', () => {
  let service: ShowcaseProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShowcaseProjectService],
    }).compile();

    service = module.get<ShowcaseProjectService>(ShowcaseProjectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
