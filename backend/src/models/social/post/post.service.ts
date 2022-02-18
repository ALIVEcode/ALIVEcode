import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { Repository } from 'typeorm';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async create(creator: UserEntity, createPostDto: Post) {
    const post = this.postRepository.save(this.postRepository.create({ ...createPostDto, creator }));
    return await post;

  }

  async findAll() {
    return await this.postRepository.find();
  }
  findAndCount(){
    return this.postRepository.findAndCount({
    })
}
  async getLastPost() {
    return await this.postRepository.find({ 
      order: { 
        id: 'DESC', 
      },
      take: 2,
    });
  }

  async findOne(id: number) {
    if (!id) throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    const post = await this.postRepository.findOne(id);
    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

}
