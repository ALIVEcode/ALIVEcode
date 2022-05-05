import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { BrowserTypes, LanguageTypes, ThemeTypes } from '../../../generics/types/sharedTypes';
import { FeedBackTypes } from '../entities/feedback.entity';
import { ACTIVITY_TYPE } from '../../course/entities/activity.entity';

export class CreateFeedbackDto {
  @IsNotEmpty()
  feedbackType: FeedBackTypes;

  @IsNotEmpty()
  feedbackMessage: string;

  @IsOptional()
  url?: string;

  @IsOptional()
  @ValidateIf((v: any) => Object.values(BrowserTypes).includes(v))
  browser?: BrowserTypes;

  @IsOptional()
  @ValidateIf((v: any) => Object.values(ThemeTypes).includes(v))
  theme?: ThemeTypes;

  @IsOptional()
  @ValidateIf((v: any) => Object.values(LanguageTypes).includes(v))
  language?: LanguageTypes;
}
