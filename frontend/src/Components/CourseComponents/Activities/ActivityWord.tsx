import { ActivityWord as ActivityWordModel } from '../../../Models/Course/activities/activity_word.entity';
import { useContext, useEffect, useState } from 'react';
import FileViewer from 'react-file-viewer';
import api from '../../../Models/api';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { downloadBlob } from '../../../Types/files.type';
import { useTranslation } from 'react-i18next';
import { useAlert } from 'react-alert';
import { CourseContext } from '../../../state/contexts/CourseContext';

/**
 * Shows an activity of type Word
 * @returns The activity of type Word
 *
 * @author Enric Soldevila
 */
const ActivityWord = ({ activity }: { activity: ActivityWordModel }) => {
	const [url, setUrl] = useState<string | undefined>(undefined);
	const [downloading, setDownloading] = useState(false);
	const { t } = useTranslation();
	const { course } = useContext(CourseContext);
	const alert = useAlert();

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

	return (
		<div className="w-full">
			{url && (
				<>
					<FileViewer
						fileType="docx"
						filePath={url}
						onError={(e: any) => console.log(e)}
					/>
					<div className="w-full flex justify-end">
						<IconButton
							icon={faDownload}
							loading={downloading}
							title={t('course.activity.WO.download_file')}
							onClick={async () => {
								if (!course || !activity.resource) return;
								setDownloading(true);
								const response =
									await api.db.courses.downloadResourceFileInActivity(
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
								setDownloading(false);
							}}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default ActivityWord;
