import { Test, TestingModule } from '@nestjs/testing';
import { ShowcaseProjectController } from './showcase-project.controller';
import { ShowcaseProjectService } from './showcase-project.service';

describe('ShowcaseProjectController', () => {
  let controller: ShowcaseProjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShowcaseProjectController],
      providers: [ShowcaseProjectService],
    }).compile();

    controller = module.get<ShowcaseProjectController>(ShowcaseProjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
