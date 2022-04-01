import { ActivityTheory as ActivityTheoryModel } from '../../../Models/Course/activities/activity_theory.entity';
import RichTextDocument from '../../RichTextComponents/RichTextDocument/RichTextDocument';
import { ActivityProps } from './activityTypes';
import api from '../../../Models/api';
import useWaitBeforeUpdate from '../../../state/hooks/useWaitBeforeUpdate';
import { ResourceTheory } from '../../../Models/Resource/resources/resource_theory.entity';
import { useState } from 'react';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';

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
	const [contentChanged, setContentChanged] = useState(false);

	const [value, setValue] = useWaitBeforeUpdate(
		{
			wait: 500,
			onUpdate: () => {
				(async () => {
					if (!activity.resource || !activity.resource.id || !contentChanged) {
						return;
					}
					activity.resource = await api.db.resources.update<ResourceTheory>(
						activity.resource,
						{ document: value },
					);
					setContentChanged(false);
				})();
			},
		},
		activity.resource?.document,
	);

	return activity.resource ? (
		activity.resource.document ? (
			<div className="w-full">
				<div>
					{editMode && (
						<div className="flex w-full justify-end opacity-50">
							{contentChanged ? <span>Saving...</span> : <span>Saved</span>}
						</div>
					)}
					<RichTextDocument
						onChange={newValue => {
							setValue(newValue);
							setContentChanged(true);
						}}
						defaultText={activity.resource.document}
						readOnly={!editMode}
					/>
				</div>
			</div>
		) : (
			<></>
		)
	) : (
		<LoadingScreen />
	);
};

export default ActivityTheory;
