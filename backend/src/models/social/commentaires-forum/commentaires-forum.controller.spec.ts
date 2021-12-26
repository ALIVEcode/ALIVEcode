import { Test, TestingModule } from '@nestjs/testing';
import { CommentairesForumController } from './commentaires-forum.controller';
import { CommentairesForumService } from './commentaires-forum.service';

describe('CommentairesForumController', () => {
  let controller: CommentairesForumController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentairesForumController],
      providers: [CommentairesForumService],
    }).compile();

    controller = module.get<CommentairesForumController>(CommentairesForumController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
