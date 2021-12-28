import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UserEntity } from 'src/models/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      UserEntity,
    ]),
  ],
  exports: [TypeOrmModule],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
