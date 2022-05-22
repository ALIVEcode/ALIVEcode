import { CourseTemplate } from './course_template.entity';
import { Type } from 'class-transformer';
import { Resource } from '../../Resource/resource.entity';

/**
 * Bundle model in the database
 * @author Enric Soldevila
 */
export class Bundle {
	id: string;

	name: string;

	description: string;

	price: number;

	@Type(() => CourseTemplate)
	courseTemplates?: CourseTemplate[];

	@Type(() => Resource)
	resources?: Resource[];
}
