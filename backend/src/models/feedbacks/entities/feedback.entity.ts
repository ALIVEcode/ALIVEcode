import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Exclude } from 'class-transformer';
import { BrowserTypes, LanguageTypes, ThemeTypes } from '../../../generics/types/sharedTypes';

export enum FeedBackTypes {
  ILike = 'like',
  IDontLike = 'dislike',
  Bug = 'bug',
  NewIdea = 'idea',
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

  @IsOptional()
  @Column({ type: 'text', nullable: true })
  url?: string;

  @IsOptional()
  @Column({ type: 'enum', enum: BrowserTypes, nullable: true })
  browser?: BrowserTypes;

  @IsOptional()
  @Column({ type: 'enum', enum: ThemeTypes, nullable: true })
  theme?: ThemeTypes;

  @IsOptional()
  @Column({ type: 'enum', enum: LanguageTypes, nullable: true })
  language?: LanguageTypes;
}
