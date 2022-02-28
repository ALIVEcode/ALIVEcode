import { ACTIVIY_TYPE } from '../../../Models/Course/activity.entity';
import { Section } from '../../../Models/Course/section.entity';

export type CreationActivityMenuProps = {
	open: boolean;
	setOpen: (bool: boolean) => void;
	sectionParent?: Section;
};
