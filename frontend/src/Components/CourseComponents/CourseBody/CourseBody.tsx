import { useContext } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';

const CourseBody = () => {
	const { openedActivity: activity } = useContext(CourseContext);

	return (
		<>
			{!activity ? (
				<div className="w-full h-full flex justify-center items-center">
					<label>This will be the loaded activity</label>
				</div>
			) : (
				<div className="w-full h-full flex flex-col overflow-y-auto">
					<div className="sticky text-2xl text-center py-8 w-full">
						{activity.name}
					</div>
					<div className="bg-blue-100 h-[1500px]"></div>
				</div>
			)}
		</>
	);
};

export default CourseBody;
