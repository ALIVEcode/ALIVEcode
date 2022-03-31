import { Section } from '../../../Models/Course/section.entity';

export type MenuActivityCreationProps = {
	open: boolean;
	setOpen: (bool: boolean) => void;
	sectionParent?: Section;
};