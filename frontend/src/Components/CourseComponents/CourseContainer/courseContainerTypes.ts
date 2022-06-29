import { Course } from '../../../Models/Course/course.entity';
import { OneOf } from '../../../Types/utils';

export type FeaturingCourses = 'iot' | 'ai' | 'code';
export type FeaturingCoursesFrom = 'alivecode' | 'public' | 'both';

export type CourseContainerProps = {
	title: string;
	dark?: boolean;
	className?: string;
} & OneOf<
	{ courses: Course[] },
	{ featuring: FeaturingCourses; featuringFrom: FeaturingCoursesFrom }
>;
