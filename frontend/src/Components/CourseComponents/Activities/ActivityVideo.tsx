import { ActivityVideo as ActivityVideoModel } from '../../../Models/Course/activities/activity_video.entity';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

/**
 * Shows an activity of type Video
 * @returns The activity of type Video
 *
 * @author Enric Soldevila
 */
const ActivityVideo = ({ activity }: { activity: ActivityVideoModel }) => {
	const { t } = useTranslation();

	const matches = useMemo(
		() =>
			activity.resource?.url.match(
				/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/,
			),
		[activity.resource?.url],
	);

	if (!matches) return <i>{t('course.activity.invalid_url')}</i>;

	const videoId = matches[6];

	return (
		<div className="w-full desktop:px-16">
			<iframe
				className="m-auto w-full aspect-video"
				src={`https://youtube.com/embed/${videoId}`}
				title="YouTube video player"
				frameBorder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		</div>
	);
};

export default ActivityVideo;
