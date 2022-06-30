import { Course } from '../../../Models/Course/course.entity';
import { OneOf } from '../../../Types/utils';
import { FeaturingQueryDTO } from '../../../Models/Course/dto/FeaturingQuery.dto';

export type FeaturingCoursesFrom = 'alivecode' | 'public' | 'both';

export type CourseContainerProps = {
	title: string;
	dark?: boolean;
	className?: string;
} & OneOf<{ courses: Course[] }, FeaturingQueryDTO>;
