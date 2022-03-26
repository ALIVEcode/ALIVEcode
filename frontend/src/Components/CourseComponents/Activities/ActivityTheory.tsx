import { ActivityTheory as ActivityTheoryModel } from '../../../Models/Course/activities/activity_theory.entity';

/**
 * Shows an activity of type Theory
 * @returns The activity of type Theory
 *
 * @author Enric Soldevila
 */
const ActivityTheory = ({ activity }: { activity: ActivityTheoryModel }) => {
	return (
		<div className="w-full">
			<div>{activity.resource?.document.toString()}</div>
		</div>
	);
};

export default ActivityTheory;
