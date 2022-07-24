import {
	RESOURCE_TYPE,
	Resource,
} from '../../../Models/Resource/resource.entity';
import { SUBJECTS } from '../../../Types/sharedTypes';
import { Descendant } from 'slate';
import { MakeCompatible, OneOf } from '../../../Types/utils';

/**
 * Props of the MenuResourceCreation component
 */
export type ModalMenuResourceCreationProps = {
	open: boolean;
	setOpen: (state: boolean) => void;
	updateMode?: boolean;
	defaultResource?: Resource;
};

export type MenuResourceCreationProps = {
	afterSubmit?: () => void;
	updateMode?: boolean;
	defaultResource?: Resource;
	noResourcePreview?: boolean;
} & OneOf<
	{ mode?: 'modal'; open: boolean; setOpen: (state: boolean) => void },
	{ mode?: 'form' }
>;

/**
 * DTO model for creating or updating a resource
 */
export type MenuResourceCreationDTO = {
	type: RESOURCE_TYPE;
	file: File | null;
	resource: {
		name: string;
		url?: string;
		document?: Descendant[];
		extension?: string;
		subject: SUBJECTS;
		challengeId?: string;
	};
};
