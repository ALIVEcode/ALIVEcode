export type FeedbackModalProps = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	onSuccess?: () => void;
	onFailure?: () => void;
};

export type CollectedInformationType = {
	[infoName: string]: {
		description: string;
		getIt: () => any;
	};
};
