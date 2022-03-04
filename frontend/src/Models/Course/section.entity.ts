import { Exclude, Type } from 'class-transformer';
import { CourseElement } from './course_element.entity';

/**
 * Section model in the database
 * @author Enric Soldevila
 */
export class Section {
	/** Id of the Section (0, 1, 2, ..., n) */
	@Exclude({ toPlainOnly: true })
	id: number;

	/** CourseElements inside the section */
	@Type(() => CourseElement)
	elements: CourseElement[];

	/** Display order of the CourseElements */
	@Type(() => Number)
	elementsOrder: number[];

	/** CourseElement attached to the section */
	@Type(() => CourseElement)
	courseElement: CourseElement;

	/** Name of the section */
	get name() {
		return this.courseElement.name;
	}
}
