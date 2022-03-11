import { useContext } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { useNavigate } from 'react-router';
import { ACTIVITY_TYPE } from '../../../Models/Course/activity.entity';
import ActivityChallenge from './ActivityLevel';

/**
 * Shows the opened activity. Renders different component depending on the type of the activity opened.
 *
 * @returns The activity currently opened. Shows the generic component and then the specific one depending
 *          on the type of the activity.
 *
 * @author Enric Soldevila
 */
const Activity = () => {
	const { openedActivity: activity } = useContext(CourseContext);
	const navigate = useNavigate();

	if (!activity) {
		navigate(-1);
		return <></>;
	}

	/**
	 * Renders the activity depending on its type
	 * @returns The specific activity depending on its type
	 */
	const renderSpecificActivity = () => {
		switch (activity.type) {
			case ACTIVITY_TYPE.CHALLENGE:
				return <ActivityChallenge />;
			default:
				return (
					<div className="w-full h-full flex justify-center items-center">
						Not implemented
					</div>
				);
		}
	};

	return (
		<div className="w-full h-full relative overflow-y-auto flex flex-col">
			<div className="z-10 sticky top-0 text-2xl text-center bg-[color:var(--background-color)] py-8 w-full border-b border-[color:var(--bg-shade-four-color)]">
				{activity.name}
			</div>
			{renderSpecificActivity()}
		</div>
	);
};

export default Activity;
