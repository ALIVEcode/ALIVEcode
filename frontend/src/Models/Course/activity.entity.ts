import { Exclude, Type } from 'class-transformer';
import { CourseElementEntity } from '../../../../backend/src/models/course/entities/course_element.entity';
import { CourseElement } from './course_element.entity';

export enum ACTIVIY_TYPE {
	THEORY,
	LEVEL,
	VIDEO,
}

export class Activity {
	@Exclude({ toPlainOnly: true })
	id: number;
	name: string;

	readonly type: ACTIVIY_TYPE;

	@Type(() => CourseElementEntity)
	course_element: CourseElement;
}
