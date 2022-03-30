import { Exclude, Type } from 'class-transformer';
import { CourseElement, CourseElementActivity } from './course_element.entity';
import { Descendant } from 'slate';
import { Resource, RESOURCE_TYPE } from '../Resource/resource.entity';
import {
	faCode,
	faBook,
	faVideo,
	faTasks,
	faQuestion,
} from '@fortawesome/free-solid-svg-icons';

export enum ACTIVITY_TYPE {
	THEORY = 'TH',
	CHALLENGE = 'CH',
	VIDEO = 'VI',
	ASSIGNMENT = 'AS',
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
	header: Descendant[] | null;

	/** Footer of the activity */
	footer: Descendant[] | null;

	/** Name of the activity */
	@Exclude()
	get name() {
		return this.courseElement.name;
	}

	// eslint-disable-next-line getter-return
	get icon() {
		return getActivityIcon(this.type);
	}

	abstract resource?: Resource;
	abstract readonly allowedResources: RESOURCE_TYPE[];
}

export const getActivityIcon = (activityType: ACTIVITY_TYPE) => {
	switch (activityType) {
		case ACTIVITY_TYPE.CHALLENGE:
			return faCode;
		case ACTIVITY_TYPE.THEORY:
			return faBook;
		case ACTIVITY_TYPE.VIDEO:
			return faVideo;
		case ACTIVITY_TYPE.ASSIGNMENT:
			return faTasks;
	}
	return faQuestion;
};
