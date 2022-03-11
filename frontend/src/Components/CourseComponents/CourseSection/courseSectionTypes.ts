import { CourseElement } from '../../../Models/Course/course_element.entity';

export type CourseSectionProps = {
	courseElement: CourseElement;
	editMode: boolean;
	depth?: number;
};
