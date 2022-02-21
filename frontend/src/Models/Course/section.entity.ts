import { Exclude } from 'class-transformer';
import { CourseElement } from './course_element.entity';

export class Section {
	@Exclude({ toPlainOnly: true })
	id: number;
	name: string;

	elements: CourseElement[];

	elements_order: number[];

	course_element: CourseElement;
}
