import { ActivityTheory as ActivityTheoryModel } from '../../../Models/Course/activities/activity_theory.entity';
import RichTextDocument from '../../RichTextComponents/RichTextDocument/RichTextDocument';
import { ActivityProps } from './activityTypes';
import api from '../../../Models/api';
import useWaitBeforeUpdate from '../../../state/hooks/useWaitBeforeUpdate';
import { ResourceTheory } from '../../../Models/Resource/resources/resource_theory.entity';
import { Descendant } from 'slate';
import { useEffect, useRef, useState } from 'react';

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
	const contentChanged = useRef(false);

	const [value, setValue] = useWaitBeforeUpdate(
		{
			wait: 500,
			onUpdate: () => {
				(async () => {
					if (
						!activity.resource ||
						!activity.resource.id ||
						!contentChanged.current
					)
						return;
					activity.resource = await api.db.resources.update<ResourceTheory>(
						activity.resource,
						{ document: value },
					);
					contentChanged.current = false;
				})();
			},
		},
		activity.resource?.document,
	);

	return (
		activity.resource?.document && (
			<div className="w-full">
				<div>
					<RichTextDocument
						onChange={newValue => {
							setValue(newValue);
							contentChanged.current = true;
						}}
						defaultText={activity.resource.document}
						readOnly={!editMode}
					/>
				</div>
			</div>
		)
	);
};

export default ActivityTheory;
