import { Activity } from './activity.entity';
import { Course } from './course.entity';
import { Section } from './section.entity';

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
}
