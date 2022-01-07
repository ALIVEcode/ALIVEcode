import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentairesForumDto } from './create-commentaires-forum.dto';

export class UpdateCommentairesForumDto extends PartialType(CreateCommentairesForumDto) {}
