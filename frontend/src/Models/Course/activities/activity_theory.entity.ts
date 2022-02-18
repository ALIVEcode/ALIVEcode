import { Type } from 'class-transformer';
import api from '../../api';
import { Activity } from '../activity.entity';

export class ActivityContent {
	body: string;
}

export class ActivityTheory extends Activity {
	@Type(() => ActivityContent)
	content: ActivityContent;

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
