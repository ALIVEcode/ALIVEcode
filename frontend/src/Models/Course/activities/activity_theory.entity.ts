import { Type } from 'class-transformer';
import api from '../../api';
import { Activity } from '../activity.entity';

export class ActivityContent {
	body: string;
}

/**
 * Activity of type theory model in the database
 * @deprecated Needs to be redone
 * @author Enric Solevila
 */
export class ActivityTheory extends Activity {
	/** Content inside the theory activity (markdown) */
	@Type(() => ActivityContent)
	content: ActivityContent;

	/**
	 * Requests to the backend the content of the activity
	 * @param courseId Id of the course containing the activity
	 * @param sectionId Id of the seciton containing the section
	 * @deprecated
	 * @returns the content of the activity
	 */
	async getContent(courseId: string, sectionId: number) {
		if (this.content) return this.content;
		const activity = await api.db.courses.getActivityContent(
			courseId,
			sectionId,
			this.id,
		);
		if (activity instanceof ActivityTheory) this.content = activity.content;
		return this;
	}
}
