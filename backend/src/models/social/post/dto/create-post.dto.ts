import { Timestamp } from "typeorm";
import { UserEntity } from '../../../user/entities/user.entity';
import { Subject } from '../../subjects/entities/subject.entity';

export class CreatePostDto {
  title: string;

  content: string;

  created_at: Timestamp;

  User: UserEntity;

  subject: Subject;
}
