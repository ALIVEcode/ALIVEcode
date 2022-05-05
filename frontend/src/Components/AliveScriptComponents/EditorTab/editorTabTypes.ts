import { EditorTabModel } from '../../ChallengeComponents/LineInterface/lineInterfaceTypes';

export type StyledEditorTabProps = {
	open: boolean;
};

export type EditorTabProps = {
	tab: EditorTabModel;
	setOpen: (bool: boolean) => void;
	onClick?: () => void;
	onOpen?: () => void;
	onClose?: () => void;
};
