import { useEffect, useState } from 'react';
import { ActivityPowerPoint as ActivityPowerPointModel } from '../../../Models/Course/activities/activity_powerpoint.entity';
import api from '../../../Models/api';

/**
 * Shows an activity of type PowerPoint
 * @returns The activity of type PowerPoint
 *
 * @author Enric Soldevila
 */
const ActivityPowerPoint = ({
	activity,
}: {
	activity: ActivityPowerPointModel;
}) => {
	const [url, setUrl] = useState<string | undefined>(undefined);

	useEffect(() => {
		const getSrc = async () => {
			const url = await api.db.courses.getResourceFileInActivity(
				activity.courseElement.course.id.toString(),
				activity.id.toString(),
			);
			setUrl(url);
		};
		getSrc();
	}, [activity]);

	const linkToPPTFile = '';

	return (
		<div className="w-full">
			<iframe
				title="Powerpoint viewer"
				src={`https://view.officeapps.live.com/op/embed.aspx?src=${linkToPPTFile}`}
				width="100%"
				height="600px"
				frameBorder="0"
			></iframe>
		</div>
	);
};

export default ActivityPowerPoint;
