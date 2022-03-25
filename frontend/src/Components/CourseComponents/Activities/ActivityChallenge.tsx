import { useEffect } from 'react';
import Challenge from '../../../Pages/Challenge/Challenge';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import { ActivityChallenge as ActivityChallengeModel } from '../../../Models/Course/activities/activity_challenge.entity';
import api from '../../../Models/api';

/**
 * Shows an activity of type Challenge
 * @returns The activity of type Challenge
 *
 * @author Enric Soldevila
 */
const ActivityChallenge = ({
	activity,
}: {
	activity: ActivityChallengeModel;
}) => {
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		/**
		 * Loads the challenge contained inside the ResourceChallenge with its id
		 * @returns void
		 */
		const loadChallenge = async () => {
			if (!activity?.resource) return;
			activity.resource.challenge = await api.db.challenges.get({
				id: activity.resource.challengeId,
			});
			console.log(activity.resource.challenge);
			forceUpdate();
		};
		loadChallenge();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activity?.resource]);

	return (
		activity && (
			<div className="w-full h-[500px]">
				{!activity.resource ? (
					<div className="w-full h-full flex flex-col justify-center items-center"></div>
				) : !activity.resource?.challenge ? (
					<LoadingScreen />
				) : (
					<div className="w-full h-full relative">
						<Challenge
							challenge={activity.resource?.challenge}
							editMode={false}
						/>
					</div>
				)}
			</div>
		)
	);
};

export default ActivityChallenge;
