import { useContext, useEffect } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import Level from '../../../Pages/Level/Level';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import api from '../../../Models/api';
import { ActivityLevel as ActivityLevelModel } from '../../../Models/Course/activity.entity';

const ActivityLevel = () => {
	const { openedActivity } = useContext(CourseContext);
	const activity = openedActivity as ActivityLevelModel;
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		const loadLevel = async () => {
			if (!activity.resource) return;
			activity.resource.level = await api.db.levels.get({
				id: activity.resource.levelId,
			});
			forceUpdate();
		};
		loadLevel();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="w-full h-full">
			{!activity.resourceId ? (
				<div className="w-full h-full flex justify-center items-center">
					There is no level in this activity
				</div>
			) : !activity.resource?.level ? (
				<LoadingScreen></LoadingScreen>
			) : (
				<div className="w-full h-full flex">
					<Level level={activity.resource?.level} editMode={false}></Level>
				</div>
			)}
		</div>
	);
};

export default ActivityLevel;
