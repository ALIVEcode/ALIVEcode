export type NavbarProps = {
	handleLogout: () => void;
	setFeedbackModalOpen: (open: boolean) => void;
};
export type FeedbackReportModalProps = {
	open: boolean;
	setOpen: (open: boolean) => void;
};