import { ActivityVideo as ActivityVideoModel } from '../../../Models/Course/activities/activity_video.entity';
import Button from '../../UtilsComponents/Buttons/Button';
import api from '../../../Models/api';
import { useContext } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { useLocation } from 'react-router';
import Link from '../../UtilsComponents/Link/Link';
import { ActivityAssignment as ActivityAssignmentModel } from '../../../Models/Course/activities/activity_assignment.entity';
import { downloadBlob } from '../../../Types/files.type';
import { useAlert } from 'react-alert';

/**
 * Shows an activity of type Video
 * @returns The activity of type Video
 *
 * @author Enric Soldevila
 */
const ActivityAssignment = ({
	activity,
}: {
	activity: ActivityAssignmentModel;
}) => {
	const { course } = useContext(CourseContext);
	const { pathname } = useLocation();
	const alert = useAlert();
	console.log(pathname);

	const handleDownload = async () => {
		if (!course || !activity.resource) return;

		const response = await api.db.courses.downloadResourceFileInActivity(
			course,
			activity,
			activity.resource.extension,
		);

		if (!response) {
			alert.error('Unsupported file type');
		} else {
			if (response.status === 200) {
				downloadBlob(
					response.data,
					activity.resource?.name,
					activity.resource?.extension,
				);
			}
		}
	};

	return (
		<div className="w-full desktop:px-16">
			{activity.resource?.url ? (
				<>
					<div className="text-lg">{activity.resource.name}</div>
					<div className="text-xs mb-2">{activity.resource.url}</div>
					<Button variant="primary" onClick={handleDownload}>
						Download
					</Button>
				</>
			) : (
				<label>Nothing to download</label>
			)}
		</div>
	);
};

export default ActivityAssignment;
