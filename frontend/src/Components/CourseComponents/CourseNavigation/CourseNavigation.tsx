import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CourseContext } from '../../../state/contexts/CourseContext';
import useRoutes from '../../../state/hooks/useRoutes';
import CourseNavigationElement from './CourseNavigationElement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

/**
 * Navigation menu of a course containing all the sections and activities
 *
 * @author MoSk3
 */
const CourseNavigation = () => {
	const { course, courseElements, setTabSelected } = useContext(CourseContext);
	const { routes, goTo } = useRoutes();
	const { t } = useTranslation();

	if (!course) {
		goTo(routes.auth.dashboard.path);
		return <></>;
	}

	return (
		<div className="w-full h-full border-r border-[color:var(--bg-shade-four-color)]">
			<div className="w-full py-3 text-2xl text-center">
				Sections{' '}
				<FontAwesomeIcon
					className="cursor-pointer"
					icon={faLayerGroup}
					onClick={() => setTabSelected({ tab: 'layout' })}
				></FontAwesomeIcon>
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
