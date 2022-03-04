import { useContext } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
const CourseBody = () => {
	const { openedActivity: activity } = useContext(CourseContext);

	return (
		<div className="w-full h-full flex justify-center items-center">
			{!activity ? (
				<label>This will be the loaded activity</label>
			) : (
				<div>{activity.name}</div>
			)}
		</div>
	);
};

export default CourseBody;
