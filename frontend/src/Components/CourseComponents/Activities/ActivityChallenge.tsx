import { useEffect, useState, useContext } from 'react';
import Challenge from '../../../Pages/Challenge/Challenge';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import { ActivityChallenge as ActivityChallengeModel } from '../../../Models/Course/activities/activity_challenge.entity';
import api from '../../../Models/api';
import Button from '../../UtilsComponents/Buttons/Button';
import { useTranslation } from 'react-i18next';
import Modal from '../../UtilsComponents/Modal/Modal';
import ResourceMenu from '../../../Pages/ResourceMenu/ResourceMenu';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { ResourceChallenge } from '../../../Models/Resource/resource_challenge.entity';

/**
 * Shows an activity of type Level
 * @returns The activity of type Level
 *
 * @author Enric Soldevila
 */
const ActivityChallenge = ({
	activity,
}: {
	activity: ActivityChallengeModel;
}) => {
	const { course } = useContext(CourseContext);
	const forceUpdate = useForceUpdate();
	const { t } = useTranslation();
	const [isModalImportResourceOpen, setIsModalImportResourceOpen] =
		useState(false);

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
			forceUpdate();
		};
		loadChallenge();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activity?.resource]);

	return (
		activity && (
			<div className="w-full h-full">
				{!activity.resourceId ? (
					<div className="w-full h-full flex flex-col justify-center items-center">
						<Button
							variant="primary"
							onClick={() => setIsModalImportResourceOpen(true)}
						>
							{t('course.activity.import_resource')}
						</Button>
						<Button variant="secondary">
							{t('course.activity.create_resource')}
						</Button>
					</div>
				) : !activity.resource?.challenge ? (
					<LoadingScreen />
				) : (
					<div className="w-full h-[500px] flex">
						<Challenge
							challenge={activity.resource?.challenge}
							editMode={false}
						/>
					</div>
				)}
				<Modal
					title={t('course.resource.import')}
					size="xl"
					setOpen={setIsModalImportResourceOpen}
					open={isModalImportResourceOpen}
				>
					<ResourceMenu
						mode="import"
						onSelectResource={async resource => {
							if (!course) return;
							await api.db.courses.addResourceInActivity(
								course,
								activity,
								resource,
							);
							activity.resource = resource as ResourceChallenge;
							setIsModalImportResourceOpen(false);
						}}
					/>
				</Modal>
			</div>
		)
	);
};

export default ActivityChallenge;
