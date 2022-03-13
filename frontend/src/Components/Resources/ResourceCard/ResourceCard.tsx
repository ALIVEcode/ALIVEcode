import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ResourceCardProps } from './resourceCardType';
import { faTrash, faWrench } from '@fortawesome/free-solid-svg-icons';
import AlertConfirm from '../../UtilsComponents/Alert/AlertConfirm/AlertConfirm';
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../../../Models/api';
import { UserContext } from '../../../state/contexts/UserContext';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import Modal from '../../UtilsComponents/Modal/Modal';
import FormEditResource from '../FormEditResource/FormEditResource';

const ResourceCard = ({ resource }: ResourceCardProps) => {
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [updateOpen, setUpdateOpen] = useState(false);
	const { t } = useTranslation();
	const { resources, setResources } = useContext(UserContext);

	if (!resources) return <LoadingScreen />;
	return (
		<div className="h-auto">
			<div className="relative flex flex-col justify-center items-center aspect-[4/3] rounded-2xl border border-[color:var(--bg-shade-four-color)] bg-[color:var(--background-color)]">
				<div>
					<FontAwesomeIcon
						className="text-[color:var(--fg-shade-four-color)]"
						size="2x"
						icon={resource.getIcon()}
					/>
				</div>
				<div className="absolute top-2 right-2">
					<FontAwesomeIcon
						className="transition-colors cursor-pointer text-[color:var(--bg-shade-three-color)] hover:text-red-500"
						icon={faTrash}
						onClick={() => setDeleteOpen(true)}
					/>
					<FontAwesomeIcon
						className="ml-2 transition-colors cursor-pointer text-[color:var(--bg-shade-three-color)] hover:text-[color:var(--foreground-color)]"
						icon={faWrench}
						onClick={() => setUpdateOpen(true)}
					/>
				</div>
			</div>
			<div className="text-center mt-4">{resource.name}</div>

			<AlertConfirm
				title={t('resources.form.delete_confirm')}
				onConfirm={async () => {
					await api.db.resources.delete({ id: resource.id });
					setResources(resources?.filter(r => r.id !== resource.id));
				}}
				setOpen={setDeleteOpen}
				open={deleteOpen}
			/>
			<Modal
				title={t('resources.form.update')}
				setOpen={setUpdateOpen}
				open={updateOpen}
				hideFooter
			>
				<FormEditResource resource={resource} />
			</Modal>
		</div>
	);
};

export default ResourceCard;
