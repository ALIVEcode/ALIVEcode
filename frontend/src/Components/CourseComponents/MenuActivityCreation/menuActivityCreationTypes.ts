import { CourseElementActivity } from '../../../Models/Course/course_element.entity';
import { Section } from '../../../Models/Course/section.entity';

/**
 * Props for the MenuActivityCreation component
 */
export type MenuActivityCreationProps = {
	open: boolean;
	setOpen: (bool: boolean) => void;
	sectionParent?: Section;
	onCreate?: (act: CourseElementActivity) => void;
};
