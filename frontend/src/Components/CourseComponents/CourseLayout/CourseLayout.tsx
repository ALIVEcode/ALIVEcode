import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CourseContext } from '../../../state/contexts/CourseContext';
import useRoutes from '../../../state/hooks/useRoutes';
import ButtonAddCourseElement from './ButtonAddCourseElement';
import CourseLayoutElement from './CourseLayoutElement';

const CourseLayout = () => {
	const { course, canEdit, courseElements, setTabSelected } =
		useContext(CourseContext);
	const { routes, goTo } = useRoutes();
	const { t } = useTranslation();

	if (!course) {
		goTo(routes.auth.dashboard.path);
		return <></>;
	}

	return (
		<div className="w-full h-full overflow-y-auto relative">
			<div className="sticky z-10 left-0 top-0">
				<FontAwesomeIcon
					icon={faArrowLeft}
					size="4x"
					className="pl-5 hover:cursor-pointer [color:var(--foreground-color)]"
					onClick={() => setTabSelected({ tab: 'navigation' })}
				/>
			</div>
			<div className="flex flex-col justify-center md:px-52 pl-3 pr-12 min-w-fit w-[100%] whitespace-nowrap">
				<div className="text-center text-2xl mb-4">Course Layout</div>
				{course.elements.length === 0 && (
					<label className="text-center">{t('course.empty')}</label>
				)}
				<div className="text-left ">
					{courseElements?.current &&
						course.elementsOrder.map(
							id =>
								id in courseElements.current && (
									<CourseLayoutElement
										key={id}
										element={courseElements.current[id]}
									/>
								),
						)}
				</div>
				<div className="pb-5">{canEdit && <ButtonAddCourseElement />}</div>
			</div>
		</div>
	);
};

export default CourseLayout;
