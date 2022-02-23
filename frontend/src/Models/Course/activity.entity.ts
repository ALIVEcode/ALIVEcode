import { Exclude, Type } from 'class-transformer';
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

	@Type(() => CourseElement)
	course_element: CourseElement;
}
