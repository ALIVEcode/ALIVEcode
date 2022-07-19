import { useState } from 'react';
import api from '../../../Models/api';
import { ResourceTheory } from '../../../Models/Resource/resources/resource_theory.entity';
import useWaitBeforeUpdate from '../../../state/hooks/useWaitBeforeUpdate';
import RichTextDocument from '../../RichTextComponents/RichTextDocument/RichTextDocument';
// import { inspect } from 'util';
import { useTranslation } from 'react-i18next';

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
	const [saving, setSaving] = useState(false);
	const [value, setValue] = useWaitBeforeUpdate(
		{
			wait: 1000,
			onUpdate: async () => {
				// console.log(inspect(value, false, null));
				const updatedResource = (await api.db.resources.update<ResourceTheory>(
					resource,
					{
						document: value,
					},
				)) as ResourceTheory;
				resource.document = updatedResource.document;
				//activity.resourceId = activity.resource.id;
				setSaving(false);
			},
		},
		resource.document ?? [],
	);
	const { t } = useTranslation();

	return (
		<div>
			{editMode && (
				<div className="flex w-full justify-end opacity-50">
					{saving ? (
						<span>{t('msg.saving')}</span>
					) : (
						<span>{t('msg.saved')}</span>
					)}
				</div>
			)}
			<RichTextDocument
				onChange={newValue => {
					if (value !== newValue) {
						setValue(newValue);
						setSaving(true);
					}
				}}
				value={value}
				readOnly={!editMode}
			/>
		</div>
	);
};

export default ResourceTheoryDocument;
