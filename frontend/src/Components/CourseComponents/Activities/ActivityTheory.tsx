import { ActivityTheory as ActivityTheoryModel } from '../../../Models/Course/activities/activity_theory.entity';
import RichTextDocument from '../../RichTextComponents/RichTextDocument/RichTextDocument';
import { ActivityProps } from './activityTypes';
import api from '../../../Models/api';
import { RESOURCE_TYPE } from '../../../Models/Resource/resource.entity';
import useWaitBeforeUpdate from '../../../state/hooks/useWaitBeforeUpdate';
import { ResourceTheory } from '../../../Models/Resource/resource_theory.entity';

/**
 * Shows an activity of type Theory
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
					console.log({ ...activity });
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
					// readOnly={!editMode}
				/>
			</div>
		</div>
	);
};

export default ActivityTheory;
