import Modal from '../../UtilsComponents/Modal/Modal';
import CreationMenu from '../CreationMenu/CreationMenu';
import TypeCard from '../../UtilsComponents/Cards/TypeCard/TypeCard';
import { faBook, faCode, faVideo } from '@fortawesome/free-solid-svg-icons';
import { CreationActivityMenuProps } from './creationActivityMenuTypes';
import { useTranslation } from 'react-i18next';
import { ACTIVIY_TYPE, Activity } from '../../../Models/Course/activity.entity';
import { useContext } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';

const CreationActivityMenu = ({
	open,
	setOpen,
	sectionParent,
}: CreationActivityMenuProps) => {
	const { t } = useTranslation();
	const { addContent } = useContext(CourseContext);

	const onSelect = async (type: ACTIVIY_TYPE) => {
		const activity = new Activity();
		activity.name = 'Default Activity';
		activity.type = type;
		await addContent(activity, sectionParent);
		setOpen(false);
	};

	return (
		<Modal
			size="lg"
			title="Create activity"
			open={open}
			setOpen={setOpen}
			closeCross
		>
			<CreationMenu>
				<TypeCard
					title={t('msg.activity_type.level')}
					icon={faCode}
					onClick={() => onSelect(ACTIVIY_TYPE.LEVEL)}
				/>
				<TypeCard
					title={t('msg.activity_type.video')}
					icon={faVideo}
					onClick={() => onSelect(ACTIVIY_TYPE.VIDEO)}
				/>
				<TypeCard
					title={t('msg.activity_type.theory')}
					icon={faBook}
					onClick={() => onSelect(ACTIVIY_TYPE.THEORY)}
				/>
			</CreationMenu>
		</Modal>
	);
};

export default CreationActivityMenu;
