import { useContext } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import Activity from '../Activities/Activity';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';

/**
 * Content of the CourseElement presently opened.
 * Sits to the right of the navigation menu
 *
 * @author Enric Soldevila
 */
const CourseBody = () => {
	const {
		tab: { openedActivity: courseElement },
		setTab,
		isCreator,
	} = useContext(CourseContext);
	const { t } = useTranslation();

	return (
		<div>
			{!courseElement ? (
				<div className="w-full h-full flex justify-center items-center pt-3 font-bold">
					<label>{t('course.activity.no_activity')}</label>
				</div>
			) : (
				<>
					{isCreator() && (
						<div className="sticky z-10 p-2 top-0 left-0 w-full bg-[color:var(--background-color)]">
							<div
								className="w-fit rounded-sm p-1 pl-0 pr-2 [color:var(--fg-shade-three-color)] font-bold cursor-pointer hover:bg-[color:var(--bg-shade-one-color)]"
								onClick={() => setTab({ tab: 'layout' })}
							>
								<FontAwesomeIcon icon={faChalkboardTeacher} className="mx-2" />
								{t('course.activity.edit_in_layout_view')}
							</div>
						</div>
					)}
					<Activity key={courseElement.id} courseElement={courseElement} />
				</>
			)}
		</div>
	);
};

export default CourseBody;
