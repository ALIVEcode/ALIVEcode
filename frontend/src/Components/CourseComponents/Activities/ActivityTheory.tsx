import { ActivityTheory as ActivityTheoryModel } from '../../../Models/Course/activities/activity_theory.entity';
import RichTextDocument from '../../RichTextComponents/RichTextDocument/RichTextDocument';
import { ActivityProps } from './activityTypes';
import api from '../../../Models/api';
import useWaitBeforeUpdate from '../../../state/hooks/useWaitBeforeUpdate';
import { ResourceTheory } from '../../../Models/Resource/resources/resource_theory.entity';

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

	const [value, setValue] = useWaitBeforeUpdate(
		{
			wait: 500,
			onUpdate: () => {
				(async () => {
					if (activity.resource && !activity.resource?.document) {
						activity.resource = await api.db.resources.update<ResourceTheory>(
							activity.resource,
							{ document: [{ type: 'paragraph', children: [{ text: '' }] }] },
						);
					}
					if (
						!activity.resource ||
						!activity.resourceId ||
						activity.resource.document === value
					)
						return;
					activity.resource = await api.db.resources.update<ResourceTheory>(
						activity.resource,
						{ document: value },
					);
				})();
			},
		},
		activity.resource?.document,
	);

	return (
		<div className="w-full">
			<div>
				<RichTextDocument
					onChange={setValue}
					defaultText={activity.resource?.document}
					readOnly={!editMode}
				/>
			</div>
		</div>
	);
};

export default ActivityTheory;
