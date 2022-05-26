import { EditorTabModel } from '../LineInterface/lineInterfaceTypes';

/**
 * This type represents the properties of a StyledAI component.
 * @param open a boolean indicating if the tab is opened.
 *
 * @author Félix Jobin
 */
export type StyledAITabProps = {
	open: boolean;
};

/**
 * This type represents the properties of an AITab.
 * @param EditorTabModel the properties of a general table.
 * @param setOpen a callback function called to set the tab open.
 * @param onClick a callback function called when the tab is clicked.
 * @param onOpen a callback function called when the tab is being opened.
 * @param onClose a callback function called when the tab is being closed.
 *
 * @author Félix Jobin, Enric Soldevila
 */
export type AITabProps = {
	tab: EditorTabModel;
	setOpen: (bool: boolean) => void;
	onClick?: () => void;
	onOpen?: () => void;
	onClose?: () => void;
};
