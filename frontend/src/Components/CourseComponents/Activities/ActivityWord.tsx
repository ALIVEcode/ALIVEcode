import { ActivityWord as ActivityWordModel } from '../../../Models/Course/activities/activity_word.entity';
import { useEffect, useState } from 'react';
import FileViewer from 'react-file-viewer';
import api from '../../../Models/api';

/**
 * Shows an activity of type Word
 * @returns The activity of type Word
 *
 * @author Enric Soldevila
 */
const ActivityWord = ({ activity }: { activity: ActivityWordModel }) => {
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

	return (
		<div className="w-full">
			{url && (
				<>
					<FileViewer
						fileType="docx"
						filePath={url}
						onError={(e: any) => console.log(e)}
					/>
				</>
			)}
		</div>
	);
};

export default ActivityWord;
