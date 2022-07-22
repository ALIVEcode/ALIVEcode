import { useEffect, useContext, useState } from 'react';
import Challenge from '../../../Pages/Challenge/Challenge';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import { ActivityChallenge as ActivityChallengeModel } from '../../../Models/Course/activities/activity_challenge.entity';
import api from '../../../Models/api';
import { ActivityProps } from './activityTypes';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { CHALLENGE_TYPE } from '../../../Models/Challenge/challenge.entity';
import useRoutes from '../../../state/hooks/useRoutes';
import { ChallengeIoT } from '../../../Models/Challenge/challenges/challenge_iot.entity';
import Link from '../../UtilsComponents/Link/Link';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../state/contexts/UserContext';

/**
 * Shows an activity of type Challenge
 * @returns The activity of type Challenge
 *
 * @author Enric Soldevila, Mathis Laroche
 */
const ActivityChallenge = ({ courseElement, editMode }: ActivityProps) => {
	const forceUpdate = useForceUpdate();
	const { course } = useContext(CourseContext);
	const { routes } = useRoutes();
	const { t } = useTranslation();
	const { user } = useContext(UserContext);
	const [iotProjectId, setIoTProjectId] = useState<string>();
	const activity = courseElement.activity as ActivityChallengeModel;

	const isChallengeCreator = () => {
		return (
			activity.resource.challenge?.type === CHALLENGE_TYPE.IOT &&
			activity.resource.challenge?.creator.id === user?.id
		);
	};

	useEffect(() => {
		/**
		 * Loads the challenge contained inside the ResourceChallenge with its id
		 * @returns void
		 */
		const loadChallenge = async () => {
			if (!activity?.resource || !course?.id) return;
			const challenge = (await api.db.courses.loadChallenge(
				course?.id,
				activity.id.toString(),
			)) as any;
			activity.resource.challenge = challenge;

			if (isChallengeCreator()) setIoTProjectId(challenge.project_id);

			forceUpdate();
		};
		loadChallenge();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activity?.resource]);

	const getChallengeHeight = () => {
		switch (activity.resource.challenge?.type) {
			case CHALLENGE_TYPE.AI:
				return '600px';
			case CHALLENGE_TYPE.IOT:
				return '600px';
			default:
				return '450px';
		}
	};

	return (
		activity && (
			<div
				className="w-full relative"
				style={{
					height: getChallengeHeight(),
				}}
			>
				{activity.resource.challenge?.type === CHALLENGE_TYPE.IOT &&
					iotProjectId && (
						<Link
							to={routes.auth.iot_project.path.replace(
								':id',
								isChallengeCreator()
									? (activity.resource.challenge as ChallengeIoT).project_id
									: iotProjectId,
							)}
							openInNewTab
						>
							{t('msg.open_in_fullscreen')}
						</Link>
					)}
				{activity.resource.challenge &&
					activity.resource.challenge?.type !== CHALLENGE_TYPE.IOT && (
						<Link
							to={
								editMode && isChallengeCreator()
									? routes.auth.challenge_edit.path.replace(
											':challengeId',
											activity.resource.challenge.id,
									  )
									: routes.auth.challenge_play.path.replace(
											':challengeId',
											activity.resource.challenge.id,
									  )
							}
							openInNewTab
						>
							{t('msg.open_in_fullscreen')}
						</Link>
					)}

				{!activity.resource ? (
					<div className="w-full h-full flex flex-col justify-center items-center" />
				) : !activity.resource?.challenge ? (
					<LoadingScreen />
				) : (
					<Challenge
						challenge={activity.resource?.challenge}
						editMode={!!editMode}
						showTerminal={!editMode}
						onProgressionLoad={p => setIoTProjectId(p.iotProjectId)}
					/>
				)}
			</div>
		)
	);
};

export default ActivityChallenge;
