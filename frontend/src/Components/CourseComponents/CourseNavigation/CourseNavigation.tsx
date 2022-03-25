import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CourseContext } from '../../../state/contexts/CourseContext';
import useRoutes from '../../../state/hooks/useRoutes';
import CourseNavigationElement from './CourseNavigationElement';

/**
 * Navigation menu of a course containing all the sections and activities
 *
 * @author Enric Soldevila
 */
const CourseNavigation = () => {
	const { course, courseElements } = useContext(CourseContext);
	const { routes, goTo } = useRoutes();
	const { t } = useTranslation();

	if (!course) {
		goTo(routes.auth.dashboard.path);
		return <></>;
	}

	return (
		<div className="w-full h-full border-r border-[color:var(--bg-shade-four-color)]">
			<div className="w-full py-3 text-2xl text-center flex justify-between">
				<div className="w-full">
					<span>Sections</span>
				</div>
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
