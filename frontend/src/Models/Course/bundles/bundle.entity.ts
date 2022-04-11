import { CourseTemplate } from './course_template.entity';
import { Type } from 'class-transformer';
import { Resource } from '../../Resource/resource.entity';

/**
 * Bundle model in the database
 * @author Enric Soldevila
 */
export class BundleEntity {
	id: string;

	name: string;

	description: string;

	price: number;

	@Type(() => CourseTemplate)
	templates: CourseTemplate[];

	@Type(() => Resource)
	resources: Resource[];
}
