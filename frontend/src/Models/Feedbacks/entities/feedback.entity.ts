import { BrowserTypes, LanguageTypes, ThemeTypes } from '../../sharedTypes';

export enum FeedBackTypes {
	ILike = 'like',
	IDontLike = 'dislike',
	Bug = 'bug',
	NewIdea = 'idea',
}

export class FeedbackEntity {
	id: string;

	feedbackType: FeedBackTypes;

	feedbackMessage: string;

	url?: string;

	browser?: BrowserTypes;

	theme?: ThemeTypes;

	language?: LanguageTypes;
}
