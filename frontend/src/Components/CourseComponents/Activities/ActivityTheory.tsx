import { ActivityTheory as ActivityTheoryModel } from '../../../Models/Course/activities/activity_theory.entity';
import { useContext, useState } from 'react';
import RichTextDocument from '../../RichTextComponents/RichTextDocument/RichTextDocument';
import { ActivityProps } from './activityTypes';
import api from '../../../Models/api';
import { Descendant } from 'slate';
import { UserContext } from '../../../state/contexts/UserContext';
import { ResourceTheory } from '../../../Models/Resource/resource_theory.entity';
import { RESOURCE_TYPE } from '../../../Models/Resource/resource.entity';
import useWaitBeforeUpdate from '../../../state/hooks/useWaitBeforeUpdate';

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
			wait: 2000,
			onUpdate: () => {
				(async () => {
					console.log({ ...activity });
					if (
						!activity.resource ||
						!activity.resourceId ||
						activity.resource.document === value
					)
						return;
					const updatedResource = await api.db.resources.update(
						{
							type: RESOURCE_TYPE.THEORY,
							uuid: activity.resourceId,
							resource: {
								name: activity.resource.name,
								subject: activity.resource.subject,
								document: value,
							},
						},
						activity.resourceId!,
					);
					activity.resource = updatedResource;
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
