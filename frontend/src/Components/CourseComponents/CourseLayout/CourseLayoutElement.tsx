import CourseLayoutActivity from './CourseLayoutActivity';
import CourseLayoutSection from './CourseLayoutSection';
import { CourseLayoutElementProps } from './courseLayoutTypes';

const CourseLayoutElement = ({
	element,
	editMode,
}: CourseLayoutElementProps) => {
	return (
		<div>
			{element.isSection() ? (
				<CourseLayoutSection section={element.section!} editMode={editMode} />
			) : (
				<CourseLayoutActivity />
			)}
		</div>
	);
};

export default CourseLayoutElement;
