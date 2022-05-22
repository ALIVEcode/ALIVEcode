import { Type } from 'class-transformer';
import { CourseTemplate } from '../course_template.entity';

export class GetCourseTemplatesDTO {
	@Type(() => CourseTemplate)
	public templates: CourseTemplate[];
}
