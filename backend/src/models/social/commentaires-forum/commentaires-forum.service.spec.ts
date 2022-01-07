import { Test, TestingModule } from '@nestjs/testing';
import { CommentairesForumService } from './commentaires-forum.service';

describe('CommentairesForumService', () => {
  let service: CommentairesForumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentairesForumService],
    }).compile();

    service = module.get<CommentairesForumService>(CommentairesForumService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
