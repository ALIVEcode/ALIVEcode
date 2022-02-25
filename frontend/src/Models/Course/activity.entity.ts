import { Exclude, Type } from 'class-transformer';
import { CourseElement } from './course_element.entity';

export enum ACTIVIY_TYPE {
	THEORY,
	LEVEL,
	VIDEO,
}

/**
 * Activity model in the database
 * @author Enric Soldevila
 */
export class Activity {
	/** Id of the activity (0, 1, 2, ..., n) */
	@Exclude({ toPlainOnly: true })
	id: number;

	/** Name of the activity */
	name: string;

	/** Type of the activity */
	readonly type: ACTIVIY_TYPE;

	/** CourseElement attached to the activity */
	@Type(() => CourseElement)
	courseElement: CourseElement;
}
