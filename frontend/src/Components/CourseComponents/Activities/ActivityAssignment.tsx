import Button from '../../UtilsComponents/Buttons/Button';
import api from '../../../Models/api';
import { useContext, useState } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { ActivityAssignment as ActivityAssignmentModel } from '../../../Models/Course/activities/activity_assignment.entity';
import { downloadBlob } from '../../../Types/files.type';
import { useAlert } from 'react-alert';
import { useTranslation } from 'react-i18next';

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
	const [downloading, setDownloading] = useState(false);
	const { course } = useContext(CourseContext);
	const { t } = useTranslation();
	const alert = useAlert();

	const handleDownload = async () => {
		if (!course || !activity.resource) return;

		setDownloading(true);
		try {
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
				} else alert.error(t('error.unknown'));
			}
		} catch {
			alert.error(t('error.unknown'));
		}

		setDownloading(false);
	};

	return (
		<div className="w-full">
			{activity.resource?.url ? (
				<>
					<div className="text-lg">{activity.resource.name}</div>
					<div className="text-xs mb-2">{activity.resource.url}</div>
					<Button
						variant="primary"
						onClick={downloading ? undefined : handleDownload}
						loading={downloading}
					>
						{t('course.activity.download_file')}
					</Button>
				</>
			) : (
				<label>{t('course.activity.no_download')}</label>
			)}
		</div>
	);
};

export default ActivityAssignment;
