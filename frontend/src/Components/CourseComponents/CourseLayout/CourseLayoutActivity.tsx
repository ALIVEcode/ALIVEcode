import { Activity as ActivityModel } from '../../../Models/Course/activity.entity';
import { CourseLayoutActivityProps } from './courseLayoutTypes';
import { useState } from 'react';
import Activity from '../Activities/Activity';
import { useTranslation } from 'react-i18next';
import Modal from '../../UtilsComponents/Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowsAlt,
	faExpand,
	faExpandAlt,
	faExpandArrowsAlt,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Useful component to show an activity (currently empty)
 *
 * @param courseElement
 *
 * @author Mathis Laroche
 */
const CourseLayoutActivity = ({ courseElement }: CourseLayoutActivityProps) => {
	const activity = courseElement.activity as ActivityModel;
	const [openActivity, setOpenActivity] = useState(false);
	const { t } = useTranslation();

	return (
		<>
			<div
				className="bg-[color:var(--bg-shade-one-color)] rounded-sm ml-4 pr-2 [color:var(--bg-shade-four-color)] font-bold cursor-pointer hover:bg-[color:var(--bg-shade-three-color)] hover:[color:grey]"
				onClick={() => setOpenActivity(true)}
			>
				<FontAwesomeIcon icon={faExpandAlt} className="mx-2" />
				{t('course.activity.open')}
			</div>

			<Modal
				open={openActivity}
				title=""
				setOpen={setOpenActivity}
				centered
				size="lg"
				hideFooter
				closeCross
			>
				<div className="h-full">
					<Activity activity={activity} />
				</div>
			</Modal>
		</>
	);
};

export default CourseLayoutActivity;
