import { useContext, useEffect } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import Level from '../../../Pages/Level/Level';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import api from '../../../Models/api';
import { ActivityLevel as ActivityLevelModel } from '../../../Models/Course/activity.entity';

/**
 * Shows an activity of type Level
 * @returns The activity of type Level
 *
 * @author Enric Soldevila
 */
const ActivityLevel = () => {
	const { openedActivity } = useContext(CourseContext);
	const activity = openedActivity as ActivityLevelModel;
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		/**
		 * Loads the level contained inside the ResourceLevel with its id
		 * @returns void
		 */
		const loadLevel = async () => {
			if (!activity.resource) return;
			activity.resource.level = await api.db.levels.get({
				id: activity.resource.levelId,
			});
			forceUpdate();
		};
		loadLevel();
	}, [activity.resource]);

	return (
		<div className="w-full h-full">
			{!activity.resourceId ? (
				<div className="w-full h-full flex justify-center items-center">
					There is no level in this activity
				</div>
			) : !activity.resource?.level ? (
				<LoadingScreen />
			) : (
				<div className="w-full h-full flex">
					<Level level={activity.resource?.level} editMode={false} />
				</div>
			)}
		</div>
	);
};

export default ActivityLevel;
