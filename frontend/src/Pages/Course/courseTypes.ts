import { CourseElementActivity } from '../../Models/Course/course_element.entity';

export type SwitchCourseTabActions = {
	tab?: CourseTabs;
	openedActivity?: CourseElementActivity | null;
};

export type CourseTabState = {
	tab: CourseTabs;
	openedActivity?: CourseElementActivity | null;
};

export type CourseTabs = 'view' | 'layout';
