import {
	CourseElementActivity,
	CourseElementSection,
} from '../../Models/Course/course_element.entity';

export type SwitchCourseTabActions = {
	tab?: CourseTabs;
	openedActivity?: CourseElementActivity | null;
	openSection?: CourseElementSection;
	closeSection?: CourseElementSection;
};

export type CourseTabState = {
	tab: CourseTabs;
	openedActivity?: CourseElementActivity | null;
	openedSections: CourseElementSection[];
};

export type CourseTabs = 'view' | 'layout';
