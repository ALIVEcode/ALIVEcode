import { useContext, useEffect } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import Challenge from '../../../Pages/Level/Challenge';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import api from '../../../Models/api';
import { ActivityChallenge as ActivityChallengeModel } from '../../../Models/Course/activity.entity';

/**
 * Shows an activity of type Level
 * @returns The activity of type Level
 *
 * @author Enric Soldevila
 */
const ActivityChallenge = () => {
	const { openedActivity } = useContext(CourseContext);
	const activity = openedActivity as ActivityChallengeModel;
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		/**
		 * Loads the challenge contained inside the ResourceChallenge with its id
		 * @returns void
		 */
		const loadChallenge = async () => {
			if (!activity.resource) return;
			activity.resource.challenge = await api.db.challenges.get({
				id: activity.resource.challengeId,
			});
			forceUpdate();
		};
		loadChallenge();
	}, [activity.resource]);

	return (
		<div className="w-full h-full">
			{!activity.resourceId ? (
				<div className="w-full h-full flex justify-center items-center">
					There is no challenge in this activity
				</div>
			) : !activity.resource?.challenge ? (
				<LoadingScreen />
			) : (
				<div className="w-full h-full flex">
					<Challenge
						challenge={activity.resource?.challenge}
						editMode={false}
					/>
				</div>
			)}
		</div>
	);
};

export default ActivityChallenge;
