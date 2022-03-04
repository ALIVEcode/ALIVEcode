import { Exclude, Type } from 'class-transformer';
import { CourseElement } from './course_element.entity';

export enum ACTIVITY_TYPE {
	THEORY = 'TH',
	LEVEL = 'LE',
	VIDEO = 'VI',
}

/**
 * Activity model in the database
 * @author Enric Soldevila
 */
export class Activity {
	/** Id of the activity (0, 1, 2, ..., n) */
	@Exclude({ toPlainOnly: true })
	id: number;

	/** Type of the activity */
	type: ACTIVITY_TYPE;

	/** CourseElement attached to the activity */
	@Type(() => CourseElement)
	courseElement: CourseElement;

	/** Name of the activity */
	get name() {
		return this.courseElement.name;
	}
}
