export type FeedbackModalProps = {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	onClose?: () => void;
	onOpen?: () => void;
};
