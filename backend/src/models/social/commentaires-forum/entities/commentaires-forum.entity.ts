import { IsNotEmpty } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
import { UserEntity } from '../../../user/entities/user.entity';
import { Post } from '../../post/entities/post.entity';

@Entity()
export class CommentairesForum {
  @ManyToOne(() => UserEntity, user => user.comment, { eager: true })
  @JoinColumn()
  @IsNotEmpty()
  creator: UserEntity;

  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  @IsNotEmpty()
  content: string;

  @Column('varchar')
  @IsNotEmpty()
  created_at: Timestamp;

  @ManyToOne(() => Post, post => post.comments)
  @JoinColumn()
  @IsNotEmpty()
  post: Post;
}
