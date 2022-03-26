import {
	Exclude,
	Expose,
	Transform,
	TransformationType,
	Type,
	plainToInstance,
} from 'class-transformer';
import { Activity, ACTIVITY_TYPE } from './activity.entity';
import { Course } from './course.entity';
import { Section } from './section.entity';
import { ActivityTheory } from './activities/activity_theory.entity';
import { ActivityVideo } from './activities/activity_video.entity';
import { ActivityChallenge } from './activities/activity_challenge.entity';

export type CourseContent = Activity | Section;

export type CourseParent = Course | Section;

/**
 * CourseElement model in the database
 * @author Mathis Laroche, Enric Soldevila
 */
@Exclude()
export class CourseElement {
	/** Id of the CourseElement (0, 1, 2, ..., n) */
	@Expose({ toClassOnly: true })
	id: number;

	/*****---Parents ---*****/
	@Expose({ toClassOnly: true })
	name: string;

	/** The course that the element belongs to */
	@Expose({ toClassOnly: true })
	@Type(() => Course)
	course: Course;

	/** If the section is not at top level (inside another section), it contains that parent section */
	@Expose({ toClassOnly: true })
	@Type(() => Section)
	sectionParent?: Section;

	/*****---------------------------------*****/

	/*****---Elements (only one at a time)---*****/

	/** If the element is an activity **/
	@Expose({ toClassOnly: true })
	@Transform(({ value: activity, type }) => {
		if (type !== TransformationType.PLAIN_TO_CLASS || !activity) {
			return activity;
		}

		if (activity.type === ACTIVITY_TYPE.CHALLENGE)
			return plainToInstance(ActivityChallenge, activity);
		if (activity.type === ACTIVITY_TYPE.VIDEO)
			return plainToInstance(ActivityVideo, activity);
		if (activity.type === ACTIVITY_TYPE.THEORY)
			return plainToInstance(ActivityTheory, activity);

		return plainToInstance(Activity, activity);
	})
	activity?: ActivityChallenge | ActivityTheory | ActivityVideo;

	/** If the element is a section **/
	@Expose({ toClassOnly: true })
	@Type(() => Section)
	section?: Section;

	/*****-----------------------------------*****/

	get parent() {
		return this.getParent();
	}

	get icon() {
		return this.activity?.icon ?? this.section?.icon;
	}

	/**
	 * Check if the element is a section
	 * @returns if the element is a section
	 * @author Mathis Laroche
	 */
	get isSection() {
		return this.section !== undefined;
	}
	/**
	 * Check if the element is an activity
	 * @returns if the element is an activity
	 * @author Mathis Laroche
	 */
	get isActivity(): boolean {
		return this.activity !== undefined;
	}

	initialize() {
		if (this.section) {
			this.section.elements || (this.section.elements = []);
			this.section.elementsOrder || (this.section.elementsOrder = []);
			this.section.courseElement = this;
		} else if (this.activity) {
			this.activity.courseElement = this;
		}
	}

	/**
	 * Get the content of the element (section or activity)
	 * @returns The content of the activity
	 * @author Mathis Laroche
	 */
	getContent(): CourseContent {
		if (!(this.activity && this.section))
			throw new TypeError(
				"The CourseElement doesn't have an activity or a section",
			);
		return this.activity || this.section;
	}

	/**
	 * Get the parent of the element (course or section)
	 * @returns The parent of the element
	 * @author Mathis Laroche
	 */
	getParent(): CourseParent {
		if (!(this.course || this.sectionParent))
			throw new TypeError("The CourseElement doesn't have a parent");
		return this.sectionParent ?? this.course;
	}

	/**
	 * Gets the name of the element, that is either the name of the section or the name of the activity
	 * @returns the name of the element
	 * @author Mathis Laroche
	 */
	getName(): string {
		return this.activity?.name || this.section!.name;
	}

	delete() {
		if (!this.parent) return;
		this.parent.elementsOrder = this.parent.elementsOrder.filter(
			id => this.id !== id,
		);
		this.parent.elements = this.parent.elements.filter(el => el.id !== this.id);
	}
}

export class CourseElementActivity extends CourseElement {
	activity: ActivityChallenge | ActivityVideo | ActivityTheory;
	section: undefined;
}

export class CourseElementSection extends CourseElement {
	activity: undefined;
	section: Section;
}
