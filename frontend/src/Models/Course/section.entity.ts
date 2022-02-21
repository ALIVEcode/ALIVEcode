import { Exclude, Type } from 'class-transformer';
import { CourseElement } from './course_element.entity';

export class Section {
	@Exclude({ toPlainOnly: true })
	id: number;
	name: string;

	@Type(() => CourseElement)
	elements: CourseElement[];

	@Type(() => Number)
	elementsOrder: number[];

	@Type(() => CourseElement)
	courseElement: CourseElement;
}
