import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
	ACTIVITY_TYPE,
	getActivityIcon,
} from '../../../Models/Course/activity.entity';
import { CourseContext } from '../../../state/contexts/CourseContext';
import TypeCard from '../../UtilsComponents/Cards/TypeCard/TypeCard';
import Modal from '../../UtilsComponents/Modal/Modal';
import { CreationActivityMenuProps } from './creationActivityMenuTypes';
import { ActivityTheory } from '../../../Models/Course/activities/activity_theory.entity';
import { ActivityChallenge } from '../../../Models/Course/activities/activity_challenge.entity';
import { ActivityVideo } from '../../../Models/Course/activities/activity_video.entity';
import { ActivityAssignment } from '../../../Models/Course/activities/activity_assignment.entity';

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

		let activity;
		switch (type) {
			case ACTIVITY_TYPE.CHALLENGE:
				activity = new ActivityChallenge();
				break;
			case ACTIVITY_TYPE.THEORY:
				activity = new ActivityTheory();
				break;
			case ACTIVITY_TYPE.VIDEO:
				activity = new ActivityVideo();
				break;
			case ACTIVITY_TYPE.ASSIGNMENT:
				activity = new ActivityAssignment();
				break;
		}
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
			<div className="bg-[color:var(--background-color)] gap-8 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3">
				<TypeCard
					title={t('msg.activity_type.challenge')}
					icon={getActivityIcon(ACTIVITY_TYPE.CHALLENGE)}
					onClick={() => onSelect(ACTIVITY_TYPE.CHALLENGE)}
				/>
				<TypeCard
					title={t('msg.activity_type.video')}
					icon={getActivityIcon(ACTIVITY_TYPE.VIDEO)}
					onClick={() => onSelect(ACTIVITY_TYPE.VIDEO)}
				/>
				<TypeCard
					title={t('msg.activity_type.theory')}
					icon={getActivityIcon(ACTIVITY_TYPE.THEORY)}
					onClick={() => onSelect(ACTIVITY_TYPE.THEORY)}
				/>
				<TypeCard
					title={t('msg.activity_type.assignment')}
					icon={getActivityIcon(ACTIVITY_TYPE.ASSIGNMENT)}
					onClick={() => onSelect(ACTIVITY_TYPE.ASSIGNMENT)}
				/>
			</div>
		</Modal>
	);
};

export default CreationActivityMenu;
