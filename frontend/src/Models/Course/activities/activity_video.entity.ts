import { Activity } from '../activity.entity';

/**
 * Activity of type Video model in the database
 * @author Enric Solevila
 */
export class ActivityVideo extends Activity {
	/** Url of the video to display */
	video: string;
}
