import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateCommentairesForumDto } from './dto/update-commentaires-forum.dto';
import { CommentairesForum } from './entities/commentaires-forum.entity';


@Injectable()
export class CommentairesForumService {
  constructor(
    @InjectRepository(CommentairesForum) private commentRepository: Repository<CommentairesForum>,
  ) {}

  async create(creator: UserEntity, createPostDto: CommentairesForum) {
    const post = this.commentRepository.save(this.commentRepository.create({ ...createPostDto, creator }));
    return await post;

  }

  findAll() {
    return `This action returns all commentairesForum`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commentairesForum`;
  }

  update(id: number, updateCommentairesForumDto: UpdateCommentairesForumDto) {
    return `This action updates a #${id} commentairesForum`;
  }

  remove(id: number) {
    return `This action removes a #${id} commentairesForum`;
  }
}
