import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';

export enum FeedBackTypes {
  ILike,
  IDontLike,
  Bug,
  NewIdea,
}

@Entity()
export class Feedback {
  @PrimaryGeneratedColumn()
  @Exclude({ toClassOnly: true })
  id: string;

  @IsNotEmpty()
  @Column({ type: 'enum', enum: FeedBackTypes, nullable: false })
  feedbackType: FeedBackTypes;
}
