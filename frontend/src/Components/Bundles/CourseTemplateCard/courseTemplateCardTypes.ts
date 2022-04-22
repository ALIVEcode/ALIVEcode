import { CourseTemplate } from '../../../Models/Course/bundles/course_template.entity';

export type CourseTemplateCardProps = {
	template: CourseTemplate;
	onSelect: (template: CourseTemplate) => void;
};
