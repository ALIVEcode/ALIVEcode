import { ActivityTheory as ActivityTheoryModel } from '../../../Models/Course/activities/activity_theory.entity';
import { ActivityProps } from './activityTypes';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import ResourceTheoryDocument from '../../Resources/ResourceTheoryDocument/ResourceTheoryDocument';

/**
 * Shows an activity of type Theory
 *
 * @param courseElement The course element to show
 * @param editMode If true, the activity can be edited
 * @returns The activity of type Theory
 *
 * @author Mathis Laroche
 */
const ActivityTheory = ({ courseElement, editMode }: ActivityProps) => {
	const activity = courseElement.activity as ActivityTheoryModel;
	return activity.resource ? (
		activity.resource.document ? (
			<div className="w-full">
				<ResourceTheoryDocument
					resource={activity.resource}
					editMode={editMode ?? false}
				/>
			</div>
		) : (
			<></>
		)
	) : (
		<LoadingScreen />
	);
};

export default ActivityTheory;
