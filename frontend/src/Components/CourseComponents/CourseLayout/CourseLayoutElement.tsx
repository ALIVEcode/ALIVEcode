import CourseLayoutActivity from './CourseLayoutActivity';
import CourseLayoutSection from './CourseLayoutSection';
import { CourseLayoutElementProps } from './courseLayoutTypes';

const CourseLayoutElement = ({
	element,
	editMode,
	depth = 0,
}: CourseLayoutElementProps) => {
	return (
		<div style={{ marginLeft: `${20 * depth}px` }}>
			{element?.isSection() ? (
				<CourseLayoutSection
					section={element.section!}
					editMode={editMode}
					depth={depth}
				/>
			) : (
				<CourseLayoutActivity />
			)}
		</div>
	);
};

export default CourseLayoutElement;
