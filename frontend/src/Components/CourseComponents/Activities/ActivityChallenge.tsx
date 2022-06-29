import { useEffect, useContext } from 'react';
import Challenge from '../../../Pages/Challenge/Challenge';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import { ActivityChallenge as ActivityChallengeModel } from '../../../Models/Course/activities/activity_challenge.entity';
import api from '../../../Models/api';
import { ActivityProps } from './activityTypes';
import { CourseContext } from '../../../state/contexts/CourseContext';

/**
 * Shows an activity of type Challenge
 * @returns The activity of type Challenge
 *
 * @author Enric Soldevila, Mathis Laroche
 */
const ActivityChallenge = ({ courseElement, editMode }: ActivityProps) => {
	const forceUpdate = useForceUpdate();
	const { course } = useContext(CourseContext);
	const activity = courseElement.activity as ActivityChallengeModel;

	useEffect(() => {
		/**
		 * Loads the challenge contained inside the ResourceChallenge with its id
		 * @returns void
		 */
		const loadChallenge = async () => {
			if (!activity?.resource || !course?.id) return;
			activity.resource.challenge = (await api.db.courses.loadChallenge(
				course?.id,
				activity.id.toString(),
			)) as any;
			forceUpdate();
		};
		loadChallenge();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activity?.resource]);

	return (
		activity && (
			<div className="w-full h-[450px] relative">
				{!activity.resource ? (
					<div className="w-full h-full flex flex-col justify-center items-center" />
				) : !activity.resource?.challenge ? (
					<LoadingScreen />
				) : (
					<Challenge
						challenge={activity.resource?.challenge}
						editMode={!!editMode}
						showTerminal={!editMode}
					/>
				)}
			</div>
		)
	);
};

export default ActivityChallenge;
