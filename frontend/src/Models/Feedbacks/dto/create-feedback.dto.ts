import { BrowserTypes, LanguageTypes, ThemeTypes } from '../../sharedTypes';
import { FeedBackTypes } from '../entities/feedback.entity';

export class CreateFeedbackDto {
	feedbackType: FeedBackTypes;

	feedbackMessage: string;

	url?: string;

	browser?: BrowserTypes;

	theme?: ThemeTypes;

	language?: LanguageTypes;
}
