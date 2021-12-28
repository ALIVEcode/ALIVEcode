import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { UserEntity } from 'src/models/user/entities/user.entity';
import { Auth } from 'src/utils/decorators/auth.decorator';
import { User } from 'src/utils/decorators/user.decorator';
import { CommentairesForumService } from './commentaires-forum.service';
import { UpdateCommentairesForumDto } from './dto/update-commentaires-forum.dto';
import { CommentairesForum } from './entities/commentaires-forum.entity';
import { DTOInterceptor } from '../../../utils/interceptors/dto.interceptor';

@Controller('commentaires-forum')
@UseInterceptors(DTOInterceptor)
export class CommentairesForumController {
  constructor(private readonly commentairesForumService: CommentairesForumService) {}

  @Post()
  @Auth()
  async create(@User() user: UserEntity, @Body() createPostDto: CommentairesForum) {
    console.log(createPostDto);
    return await this.commentairesForumService.create(user, createPostDto);
  }

  @Get()
  findAll() {
    return this.commentairesForumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentairesForumService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentairesForumDto: UpdateCommentairesForumDto) {
    return this.commentairesForumService.update(+id, updateCommentairesForumDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentairesForumService.remove(+id);
  }
}
