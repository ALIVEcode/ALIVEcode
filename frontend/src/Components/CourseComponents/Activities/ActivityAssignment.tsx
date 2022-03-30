import { ActivityVideo as ActivityVideoModel } from '../../../Models/Course/activities/activity_video.entity';
import Button from '../../UtilsComponents/Buttons/Button';

/**
 * Shows an activity of type Video
 * @returns The activity of type Video
 *
 * @author Enric Soldevila
 */
const ActivityAssignment = ({ activity }: { activity: ActivityVideoModel }) => {
	return (
		<div className="w-full desktop:px-16">
			{activity.resource?.url ? (
				<>
					<div className="text-lg">{activity.resource.name}</div>
					<div className="text-xs mb-2">{activity.resource.url}</div>
					<Button variant="primary">Download</Button>
				</>
			) : (
				<label>Nothing to download</label>
			)}
		</div>
	);
};

export default ActivityAssignment;
