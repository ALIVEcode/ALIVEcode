import { Course } from '../../../Models/Course/course.entity';
import { OneOf } from '../../../Types/utils';
import { FeaturingQueryDTO } from '../../../Models/Course/dto/FeaturingQuery.dto';

export type FeaturingCoursesFrom = 'alivecode' | 'public' | 'both';

export type FeaturedCourseContainerProps = {
	title: string;
	dark?: boolean;
	className?: string;
	dismiss?: boolean;
	link?: {
		to: string;
		title: string;
	};
} & OneOf<{ courses: Course[] }, FeaturingQueryDTO>;
