import { faBook, faCode, faVideo } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
	Activity,
	ACTIVITY_TYPE,
} from '../../../Models/Course/activity.entity';
import { CourseContext } from '../../../state/contexts/CourseContext';
import TypeCard from '../../UtilsComponents/Cards/TypeCard/TypeCard';
import Modal from '../../UtilsComponents/Modal/Modal';
import CreationMenu from '../CreationMenu/CreationMenu';
import { CreationActivityMenuProps } from './creationActivityMenuTypes';

const CreationActivityMenu = ({
	open,
	setOpen,
	sectionParent,
}: CreationActivityMenuProps) => {
	const { t } = useTranslation();
	const { addContent } = useContext(CourseContext);

	const onSelect = async (type: ACTIVITY_TYPE) => {
		setOpen(false);
		const activity = new Activity();
		activity.type = type;
		await addContent(activity, 'New Activity', sectionParent);
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
					onClick={() => onSelect(ACTIVITY_TYPE.LEVEL)}
				/>
				<TypeCard
					title={t('msg.activity_type.video')}
					icon={faVideo}
					onClick={() => onSelect(ACTIVITY_TYPE.VIDEO)}
				/>
				<TypeCard
					title={t('msg.activity_type.theory')}
					icon={faBook}
					onClick={() => onSelect(ACTIVITY_TYPE.THEORY)}
				/>
			</CreationMenu>
		</Modal>
	);
};

export default CreationActivityMenu;
