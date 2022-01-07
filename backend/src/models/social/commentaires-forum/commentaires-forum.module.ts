import { Module } from '@nestjs/common';
import { CommentairesForumService } from './commentaires-forum.service';
import { CommentairesForumController } from './commentaires-forum.controller';
import { CommentairesForum } from './entities/commentaires-forum.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CommentairesForum,
      UserEntity,
    ]),
  ],
  controllers: [CommentairesForumController],
  providers: [CommentairesForumService]
})
export class CommentairesForumModule {}


