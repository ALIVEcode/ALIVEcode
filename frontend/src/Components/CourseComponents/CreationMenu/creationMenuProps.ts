export type CreationMenuProps<T> = {
	open: boolean;
	setOpen: (state: boolean) => void;
	title: string;
	state: T;
	children: React.ReactNode;
};
