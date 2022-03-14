export type CreationMenuProps = {
	open: boolean;
	setOpen: (state: boolean) => void;
	title: string;
	children: React.ReactNode;
	onSubmit: () => void;
};
