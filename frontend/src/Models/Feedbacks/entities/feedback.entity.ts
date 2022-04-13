export enum FeedBackTypes {
	ILike,
	IDontLike,
	Bug,
	NewIdea,
}

export class FeedbackEntity {
	feedbackType: FeedBackTypes;
}
