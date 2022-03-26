import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CourseContext } from '../../../state/contexts/CourseContext';
import useRoutes from '../../../state/hooks/useRoutes';
import CourseNavigationElement from './CourseNavigationElement';
import { faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Navigation menu of a course containing all the sections and activities
 *
 * @author Enric Soldevila
 */
const CourseNavigation = () => {
	const { course, courseElements, setTab } = useContext(CourseContext);
	const { routes, goTo } = useRoutes();
	const { t } = useTranslation();

	if (!course) {
		goTo(routes.auth.dashboard.path);
		return <></>;
	}

	return (
		<div className="w-full h-full border-r border-[color:var(--bg-shade-four-color)]">
			<div className="w-full py-3 text-2xl text-center flex justify-between">
				<span className="pl-5 pt-2">Sections</span>
				<FontAwesomeIcon
					icon={faChalkboardTeacher}
					size="2x"
					className="pr-5 hover:cursor-pointer [color:var(--foreground-color)]"
					onClick={() => setTab({ tab: 'layout', openedActivity: null })}
				/>
			</div>
			<div className="course-nav-body">
				{course.elementsOrder.length === 0 && (
					<label>{t('course.empty')}</label>
				)}

				{courseElements?.current &&
					course.elementsOrder.map(
						id =>
							id in courseElements.current && (
								<CourseNavigationElement
									key={id}
									element={courseElements.current[id]}
								/>
							),
					)}
			</div>
		</div>
	);
};

export default CourseNavigation;
