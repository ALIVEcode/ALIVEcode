import { CourseContainerProps } from './courseContainerTypes';
import CourseCard from '../../CourseComponents/CourseCard/CourseCard';

/**
 * Container used to display cards components in a grid
 *
 * @param title title in the header of the component
 * @param titleSize css size of the title (optional)
 * @param icon icon displayed after the title (optional)
 * @param height minimumHeight that takes the component (optional)
 * @param asRow adds a row that wraps around the children (optional)
 * @param scrollX css scrollX property (optional)
 * @param scrollY css scrollY property (optional)
 * @param onIconClick function that triggers onClick of icon (optional)
 * @param style tsx style property (optional)
 * @param className (optional)
 * @param children
 * @returns tsx element
 *
 * @author Enric Soldevila
 */
const CourseContainer = ({ courses }: CourseContainerProps) => {
	return (
		<div className="h-full mt-4 justify-start">
			<div className="grid place-items-start phone:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4 big:grid-cols-5 gap-4">
				{courses.map((c, idx) => (
					<CourseCard key={idx} course={c}></CourseCard>
				))}
			</div>
		</div>
	);
};

export default CourseContainer;
