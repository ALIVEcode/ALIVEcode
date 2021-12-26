import { Exclude, Type } from "class-transformer";
import { Activity } from './activity.entity';
import api from '../api';

export class Section {
	@Exclude({ toPlainOnly: true })
	id: number;
	name: string;

	@Type(() => Activity)
	activities?: Activity[];

	async getActivities(courseId: string) {
		if (this.activities) return this.activities;
		this.activities = await api.db.courses.getActivities(courseId, this.id);
		return this.activities;
	}
}