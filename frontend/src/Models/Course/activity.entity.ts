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
	faFilePdf,
} from '@fortawesome/free-solid-svg-icons';
import { commonColors } from '../../state/contexts/ThemeContext';

/** All the types of activities */
export enum ACTIVITY_TYPE {
	THEORY = 'TH',
	CHALLENGE = 'CH',
	VIDEO = 'VI',
	PDF = 'PF',
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

	/**
	 * Gets the display icon of the activity depending on its type
	 * @author Enric Soldevila
	 */
	get icon() {
		return getActivityIcon(this.type);
	}

	get color() {
		return getActivityColor(this.type);
	}

	get enumKey() {
		return getActivityEnumKey(this.type);
	}

	/** Resource inside the activity */
	abstract resource?: Resource;

	/** Allowed resources types in the activity for the ResourceMenu filters */
	abstract readonly allowedResources: RESOURCE_TYPE[];
}

/**
 * Gets the icon of an activity depending on its type
 * @param activityType Type of the activity
 * @returns The good display icon
 * @author Enric Soldevila
 */
export const getActivityIcon = (activityType: ACTIVITY_TYPE) => {
	switch (activityType) {
		case ACTIVITY_TYPE.CHALLENGE:
			return faCode;
		case ACTIVITY_TYPE.THEORY:
			return faBook;
		case ACTIVITY_TYPE.VIDEO:
			return faVideo;
		case ACTIVITY_TYPE.PDF:
			return faFilePdf;
		case ACTIVITY_TYPE.ASSIGNMENT:
			return faTasks;
	}
	return faQuestion;
};

export const getActivityColor = (activityType: ACTIVITY_TYPE): string => {
	switch (activityType) {
		case ACTIVITY_TYPE.CHALLENGE:
			return commonColors.challenge;
		case ACTIVITY_TYPE.THEORY:
			return commonColors.theory;
		case ACTIVITY_TYPE.VIDEO:
			return commonColors.video;
		case ACTIVITY_TYPE.PDF:
			return commonColors.pdf;
		case ACTIVITY_TYPE.ASSIGNMENT:
			return commonColors.assignment;
	}
	return 'var(--fg-shade-four-color)';
};

export const getActivityEnumKey = (type: ACTIVITY_TYPE) => {
	const foundKey = Object.entries(ACTIVITY_TYPE).find(
		entry => entry[1] === type,
	);
	if (!foundKey) return 'theory';
	return foundKey[0].toLowerCase();
};
