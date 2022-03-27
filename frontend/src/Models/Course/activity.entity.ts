import { faBook, faCode, faVideo } from '@fortawesome/free-solid-svg-icons';
import { Exclude, Type } from 'class-transformer';
import { CourseElement, CourseElementActivity } from './course_element.entity';
import { Descendant } from 'slate';
import { Resource } from '../Resource/resource.entity';

export enum ACTIVITY_TYPE {
	THEORY = 'TH',
	CHALLENGE = 'CH',
	VIDEO = 'VI',
}

/**
 * Activity model in the database
 * @author Enric Soldevila, Mathis Laroche
 */
export abstract class Activity {
	/** Id of the activity (0, 1, 2, ..., n) */
	@Exclude({ toPlainOnly: true })
	id: number;

	/** Type of the activity */
	type: ACTIVITY_TYPE;

	/** CourseElement attached to the activity */
	@Type(() => CourseElement)
	@Exclude({ toPlainOnly: true })
	courseElement: CourseElementActivity;

	/** Header of the activity */
	header: Descendant[];

	/** Footer of the activity */
	footer: Descendant[];

	/** Name of the activity */
	@Exclude()
	get name() {
		return this.courseElement.name;
	}

	// eslint-disable-next-line getter-return
	get icon() {
		switch (this.type) {
			case ACTIVITY_TYPE.CHALLENGE:
				return faCode;
			case ACTIVITY_TYPE.THEORY:
				return faBook;
			case ACTIVITY_TYPE.VIDEO:
				return faVideo;
		}
	}

	abstract resource?: Resource;
}
