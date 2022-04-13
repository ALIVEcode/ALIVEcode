import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Exclude } from 'class-transformer';

export enum FeedBackTypes {
  ILike,
  IDontLike,
  Bug,
  NewIdea,
}

@Entity()
export class FeedbackEntity {
  @PrimaryGeneratedColumn()
  @Exclude({ toClassOnly: true })
  id: string;

  @IsNotEmpty()
  @Column({ type: 'enum', enum: FeedBackTypes, nullable: false })
  feedbackType: FeedBackTypes;

  @IsNotEmpty()
  @Column({ type: 'text', nullable: false })
  feedbackMessage: string;
}













