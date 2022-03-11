import { useState, useEffect, useContext } from 'react';
import ResourceCard from '../../Components/Resources/ResourceCard/ResourceCard';
import Button from '../../Components/UtilsComponents/Buttons/Button';
import Modal from '../../Components/UtilsComponents/Modal/Modal';
import { UserContext } from '../../state/contexts/UserContext';
import { useTranslation } from 'react-i18next';
import FormCreateResource from '../../Components/Resources/FormCreateResource/FormCreateResource';
import { SUBJECTS } from '../../Types/sharedTypes';
import api from '../../Models/api';
import LoadingScreen from '../../Components/UtilsComponents/LoadingScreen/LoadingScreen';

const ResourcesMenu = () => {
	const [creationModalOpen, setCreationModalOpen] = useState(false);
	const { t } = useTranslation();
	const { user, resources, setResources } = useContext(UserContext);

	useEffect(() => {
		if (!user) return;
		const getResources = async () => {
			setResources(await api.db.users.getResources({ id: user.id }));
		};
		getResources();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="w-full h-full flex flex-row bg-[color:var(--background-color)]">
			<div className="w-1/6 flex flex-col border-r border-[color:var(--bg-shade-four-color)]">
				<div className="h-20 border-b border-[color:var(--bg-shade-four-color)]">
					YO
				</div>
			</div>
			<div className="flex flex-col w-full h-full">
				<div className="h-20 border-b border-[color:var(--bg-shade-four-color)]">
					YO
				</div>
				<div className="w-full h-full p-4">
					<div className="flex flex-col items-center mb-4">
						<Button
							variant="primary"
							onClick={() => setCreationModalOpen(true)}
						>
							Create a resource
						</Button>
					</div>
					<div className="grid grid-cols-1 phone:grid-cols-2 tablet:grid-cols-4 laptop:grid-cols-6 desktop:grid-cols-7 gap-4">
						{!resources ? (
							<LoadingScreen relative></LoadingScreen>
						) : (
							resources.map((r, idx) => <ResourceCard resource={r} key={idx} />)
						)}
					</div>
				</div>
			</div>
			<Modal
				title={t('resources.form.create')}
				setOpen={setCreationModalOpen}
				open={creationModalOpen}
				hideFooter
			>
				<FormCreateResource subject={SUBJECTS.CODE} />
			</Modal>
		</div>
	);
};

export default ResourcesMenu;
