import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CourseContext } from '../../../state/contexts/CourseContext';
import useRoutes from '../../../state/hooks/useRoutes';
import CenteredContainer from '../../UtilsComponents/CenteredContainer/CenteredContainer';
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
		<div className="relative pt-3">
			<FontAwesomeIcon
				icon={faArrowLeft}
				size="4x"
				className="pl-5 md:sticky z-[1000] left-0 top-14 hover:cursor-pointer [color:var(--foreground-color)]"
				onClick={() => setTabSelected({ tab: 'navigation' })}
			/>

			<CenteredContainer
				horizontally
				className="md:px-52 pl-3 pr-12 min-w-fit w-[100%] whitespace-nowrap"
			>
				<div className="text-left ">
					{course.elementsOrder.length === 0 && (
						<label>{t('course.empty')}</label>
					)}

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
			</CenteredContainer>
		</div>
	);
};

export default CourseLayout;
