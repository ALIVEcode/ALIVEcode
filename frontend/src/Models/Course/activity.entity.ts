import { Exclude, Type } from 'class-transformer';
import api from '../api';
import { ActivityLevel } from './activity_level.entity';

export class ActivityContent {
	data: string;
}

export class Activity {
	@Exclude({ toPlainOnly: true })
	id: number;

	name: string;

	@Type(() => ActivityContent)
	content?: ActivityContent;

	@Type(() => ActivityLevel)
	levels?: ActivityLevel[];

	async getContent(courseId: string, sectionId: number) {
		if (this.content) return this.content;
		const { content, levels } = await api.db.courses.getActivityContent(
			courseId,
			sectionId,
			this.id,
		);
		this.content = content;
		this.levels = levels;
		return this;
	}
}