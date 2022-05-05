import { Resource } from '../../../Resource/resource.entity';
import { Type } from 'class-transformer';
import { CourseTemplate } from '../course_template.entity';

export class ClaimBundleDTO {
	@Type(() => Resource)
	resources: Resource[];

	@Type(() => CourseTemplate)
	templates: CourseTemplate[];
}
