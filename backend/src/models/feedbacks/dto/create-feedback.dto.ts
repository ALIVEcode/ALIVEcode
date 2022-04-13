import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BrowserTypes, LanguageTypes, ThemeTypes } from '../../../generics/types/sharedTypes';
import { FeedBackTypes } from '../entities/feedback.entity';

export class CreateFeedbackDto {
	@IsNotEmpty()
	feedbackType: FeedBackTypes;

	@IsNotEmpty()
	feedbackMessage: string;

	@IsOptional()
	url?: string;

	@IsOptional()
	browser?: BrowserTypes;

	@IsOptional()
	theme?: ThemeTypes;

	@IsOptional()
	language?: LanguageTypes;
}
