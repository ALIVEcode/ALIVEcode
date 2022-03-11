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

/**
 * Creation Menu for an activity
 * @param open The state of the menu (false -> close, true -> opened)
 * @param setOpen The function to change the state of the menu
 * @param sectionParent (Optional) Section parent of the element. If undefined, the element is in the course
 * @returns The Creation menu
 *
 * @author Enric Soldevila
 */
const CreationActivityMenu = ({
	open,
	setOpen,
	sectionParent,
}: CreationActivityMenuProps) => {
	const { t } = useTranslation();
	const { addContent } = useContext(CourseContext);

	/**
	 * Function called when clicking a type of activity to create.
	 * Add the activity to the CourseContent and closes the menu
	 * @param type The type of the activity created
	 */
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
					title={t('msg.activity_type.challenge')}
					icon={faCode}
					onClick={() => onSelect(ACTIVITY_TYPE.CHALLENGE)}
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
