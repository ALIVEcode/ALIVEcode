import { CourseTemplate } from '../../../Models/Course/bundles/course_template.entity';
/**
 * Props for the CourseTemplateCard
 */
export type CourseTemplateCardProps = {
	template: CourseTemplate;
	onSelect?: (template: CourseTemplate) => void;
	className?: string;
};
