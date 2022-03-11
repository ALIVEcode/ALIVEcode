import { faBook, faCode, faVideo } from '@fortawesome/free-solid-svg-icons';
import { Exclude, Type } from 'class-transformer';
import { ResourceChallenge } from '../Resource/resource_challenge.entity';
import { CourseElement } from './course_element.entity';

export enum ACTIVITY_TYPE {
	THEORY = 'TH',
	CHALLENGE = 'CH',
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
	@Exclude({ toPlainOnly: true })
	courseElement: CourseElement;

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
}

/**
 * Activity of type Challenge model in the database
 * @author Enric Solevila
 */
export class ActivityChallenge extends Activity {
	/** Resource */
	@Type(() => ResourceChallenge)
	resource?: ResourceChallenge;

	/** Id of the resource resource */
	resourceId?: string;
}
