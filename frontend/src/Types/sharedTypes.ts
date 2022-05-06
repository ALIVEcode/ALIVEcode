import {
	faBrain,
	faClipboardList,
	faCode,
} from '@fortawesome/free-solid-svg-icons';
import { faCloudsmith } from '@fortawesome/free-brands-svg-icons';

/** Enum of all the subjects in ALIVEcode */
export enum SUBJECTS {
	CODE = 'CO',
	IOT = 'IOT',
	AI = 'AI',
	OTHER = 'OT',
}

/**
 * Gets the icon of a subject
 * @param subject Subject to get the icon of
 * @returns The good display icon
 * @author Enric Soldevila
 */
export const getSubjectIcon = (subject: SUBJECTS) => {
	switch (subject) {
		case SUBJECTS.CODE:
			return faCode;
		case SUBJECTS.IOT:
			return faCloudsmith;
		case SUBJECTS.AI:
			return faBrain;
		case SUBJECTS.OTHER:
			return faClipboardList;
	}
	return faCode;
};
