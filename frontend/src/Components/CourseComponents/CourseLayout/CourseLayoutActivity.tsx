import { Activity as ActivityModel } from '../../../Models/Course/activity.entity';
import { CourseLayoutActivityProps } from './courseLayoutTypes';
import { useContext } from 'react';
import Activity from '../Activities/Activity';
import { useTranslation } from 'react-i18next';
import Modal from '../../UtilsComponents/Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { CourseContext } from '../../../state/contexts/CourseContext';

/**
 * Useful component to show an activity (currently empty)
 *
 * @param courseElement
 *
 * @author Mathis Laroche
 */
const CourseLayoutActivity = ({ courseElement }: CourseLayoutActivityProps) => {
	const activity = courseElement.activity as ActivityModel;
	const { t } = useTranslation();
	const {
		closeOpenedActivity,
		openActivity,
		openedActivity,
		setTabSelected,
		tabSelected,
	} = useContext(CourseContext);

	return (
		<>
			<div
				className="bg-[color:var(--bg-shade-one-color)] rounded-sm ml-4 pr-2 [color:var(--bg-shade-four-color)] font-bold cursor-pointer hover:bg-[color:var(--bg-shade-three-color)] hover:[color:grey]"
				onClick={() =>
					courseElement.activity !== undefined &&
					openActivity(courseElement.activity)
				}
			>
				<FontAwesomeIcon icon={faExpandAlt} className="mx-2" />
				{t('course.activity.open')}
			</div>
			<Modal
				key={courseElement.activity?.id + tabSelected.tab}
				size="lg"
				open={openedActivity === courseElement.activity}
				setOpen={(state: boolean) => !state && closeOpenedActivity()}
				centered
				hideTitle
				hideFooter
				closeCross
				dialogClassName="rounded-[3px] h-full"
				backdropClassName="bg-[color:black] opacity-50"
				topBar={
					<div
						className="w-fit rounded-sm pr-2 py-1 ml-1 mt-1 [color:var(--bg-shade-four-color)] font-bold cursor-pointer hover:bg-[color:var(--bg-shade-one-color)] hover:[color:grey]"
						onClick={() => setTabSelected({ tab: 'navigation' })}
					>
						<FontAwesomeIcon icon={faExpandAlt} className="mx-2" />
						{t('course.activity.open_in_student_view')}
					</div>
				}
			>
				<div className="h-full">
					<Activity editMode activity={activity} />
				</div>
			</Modal>
		</>
	);
};

export default CourseLayoutActivity;
