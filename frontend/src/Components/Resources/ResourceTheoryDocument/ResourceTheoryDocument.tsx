import { useState } from 'react';
import api from '../../../Models/api';
import { ResourceTheory } from '../../../Models/Resource/resources/resource_theory.entity';
import useWaitBeforeUpdate from '../../../state/hooks/useWaitBeforeUpdate';
import RichTextDocument from '../../RichTextComponents/RichTextDocument/RichTextDocument';

/**
 * Component that renders a theory document from a resource
 */
const ResourceTheoryDocument = ({
	resource,
	editMode,
}: {
	resource: ResourceTheory;
	editMode: boolean;
}) => {
	console.log('HERE');
	const [contentChanged, setContentChanged] = useState(false);
	const [value, setValue] = useWaitBeforeUpdate(
		{
			wait: 1000,
			onUpdate: () => {
				(async () => {
					if (!contentChanged) return;
					const updatedResource =
						(await api.db.resources.update<ResourceTheory>(resource, {
							document: value,
						})) as ResourceTheory;
					resource.document = updatedResource.document;
					//activity.resourceId = activity.resource.id;
					setContentChanged(false);
				})();
			},
		},
		resource.document,
	);

	return (
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
				defaultText={resource.document ?? []}
				readOnly={!editMode}
			/>
		</div>
	);
};

export default ResourceTheoryDocument;
