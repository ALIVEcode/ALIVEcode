import { ActivityVideo as ActivityVideoModel } from '../../../Models/Course/activities/activity_video.entity';

/**
 * Shows an activity of type Video
 * @returns The activity of type Video
 *
 * @author Enric Soldevila
 */
const ActivityVideo = ({ activity }: { activity: ActivityVideoModel }) => {
	return (
		activity.resource && (
			<div className="w-full">
				<div className="w-full h-full relative">
					<iframe
						width="560"
						height="315"
						src="https://www.youtube.com/embed/dQw4w9WgXcQ"
						title="YouTube video player"
						frameBorder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					></iframe>
				</div>
			</div>
		)
	);
};

export default ActivityVideo;
