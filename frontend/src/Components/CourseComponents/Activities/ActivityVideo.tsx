import { ActivityVideo as ActivityVideoModel } from '../../../Models/Course/activities/activity_video.entity';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export const parseVideoURL = (url: string) => {
	return url.match(
		/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/,
	);
};

/**
 * Shows an activity of type Video
 * @returns The activity of type Video
 *
 * @author Enric Soldevila
 */
const ActivityVideo = ({ activity }: { activity: ActivityVideoModel }) => {
	const { t } = useTranslation();

	/** Parse the youtube url using regex to get the import parts of the url  */
	const matches = useMemo(
		() => activity.resource?.url && parseVideoURL(activity.resource?.url),
		[activity.resource?.url],
	);

	if (!activity.resource?.isFile() && !matches)
		return <i>{t('resources.VI.form.invalid_url')}</i>;

	const videoId = matches && matches[6];

	return (
		<div className="w-full desktop:px-16">
			{activity.resource?.isFile() ? (
				<video
					className="m-auto w-full aspect-video"
					src={`${process.env.BACKEND_URL}/courses/${activity.courseElement.course.id}/activities/${activity.courseElement.activity.id}/video`}
					preload="none"
					controls
				/>
			) : (
				<iframe
					className="m-auto w-full aspect-video"
					src={`https://youtube.com/embed/${videoId}`}
					title="YouTube video player"
					frameBorder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowFullScreen
				/>
			)}
		</div>
	);
};

export default ActivityVideo;
