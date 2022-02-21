import { Activity } from './activity.entity';
import { Course } from './course.entity';
import { Section } from './section.entity';

export type CourseContent = Activity | Section;

export type CourseParent = Course | Section;

/**
 * @author Enric Soldevila
 */
export class CourseElement {
	id: number;

	/*****---Parents ---*****/

	/** The course that the element belongs to */
	course: Course;

	/** If the section is not at top level (inside another section), it contains that parent section */
	sectionParent?: Section;

	/*****---------------------------------*****/

	/*****---Elements (only one at a time)---*****/

	/** If the element is an activity **/
	activity?: Activity;

	/** If the element is a section **/
	section?: Section;

	/*****-----------------------------------*****/

	/**
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
	 * @author Mathis Laroche
	 */
	getParent(): CourseParent {
		if (!(this.courseParent && this.sectionParent))
			throw new TypeError("The CourseElement doesn't have a parent");
		return this.courseParent || this.sectionParent;
	}
}
