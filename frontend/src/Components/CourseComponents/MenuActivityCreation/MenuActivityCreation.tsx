import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
	ACTIVITY_TYPE,
	getActivityIcon,
} from '../../../Models/Course/activity.entity';
import { CourseContext } from '../../../state/contexts/CourseContext';
import TypeCard from '../../UtilsComponents/Cards/TypeCard/TypeCard';
import Modal from '../../UtilsComponents/Modal/Modal';
import { MenuActivityCreationProps } from './menuActivityCreationTypes';
import { ActivityTheory } from '../../../Models/Course/activities/activity_theory.entity';
import { ActivityChallenge } from '../../../Models/Course/activities/activity_challenge.entity';
import { ActivityVideo } from '../../../Models/Course/activities/activity_video.entity';
import { ActivityPdf } from '../../../Models/Course/activities/activity_pdf.entity';
import { ActivityAssignment } from '../../../Models/Course/activities/activity_assignment.entity';
import { CourseElementActivity } from '../../../Models/Course/course_element.entity';
import { getActivityColor } from '../../../Models/Course/activity.entity';

/**
 * Creation Menu for an activity
 * @param open The state of the menu (false -> close, true -> opened)
 * @param setOpen The function to change the state of the menu
 * @param sectionParent (Optional) Section parent of the element. If undefined, the element is in the course
 * @param onCreate (Optional) callback called when an activity is created with the new activity as a paremeter
 * @returns The Creation menu
 *
 * @author Enric Soldevila
 */
const MenuActivityCreation = ({
	open,
	setOpen,
	sectionParent,
	onCreate,
}: MenuActivityCreationProps) => {
	const { t } = useTranslation();
	const { addContent, courseElements } = useContext(CourseContext);

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
			case ACTIVITY_TYPE.PDF:
				activity = new ActivityPdf();
				break;
			case ACTIVITY_TYPE.ASSIGNMENT:
				activity = new ActivityAssignment();
				break;
		}
		activity.type = type;

		if (courseElements) {
			let activityNb = 0;
			Object.values(courseElements.current).forEach(el => {
				if (el.isActivity) activityNb++;
			});
			const el = await addContent(
				activity,
				t('course.activity.new_name', { num: activityNb + 1 }),
				sectionParent,
			);
			if (!el) return;
			onCreate && onCreate(el as CourseElementActivity);
		}
	};

	const activityTypes = [
		ACTIVITY_TYPE.THEORY,
		ACTIVITY_TYPE.PDF,
		ACTIVITY_TYPE.VIDEO,
		ACTIVITY_TYPE.CHALLENGE,
		ACTIVITY_TYPE.ASSIGNMENT,
	];

	const getEnumKey = (enumValue: ACTIVITY_TYPE) => {
		const foundKey = Object.entries(ACTIVITY_TYPE).find(
			entry => entry[1] === enumValue,
		);
		if (!foundKey) return 'theory';
		return foundKey[0].toLowerCase();
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
				{activityTypes.map(actType => (
					<TypeCard
						key={actType.toLowerCase()}
						title={t(`msg.activity_type.${getEnumKey(actType)}`)}
						tooltip={t(`msg.activity_type.${getEnumKey(actType)}`)}
						color={getActivityColor(actType)}
						icon={getActivityIcon(actType)}
						onClick={() => onSelect(actType)}
					/>
				))}
			</div>
		</Modal>
	);
};

export default MenuActivityCreation;
