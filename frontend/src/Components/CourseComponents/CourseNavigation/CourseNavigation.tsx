import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { Disclosure } from '@headlessui/react';
import useRoutes from '../../../state/hooks/useRoutes';
import CourseNavigationElement from './CourseNavigationElement';
import {
	faChalkboardTeacher,
	faWindowMaximize,
	faWindowMinimize,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Navigation menu of a course containing all the sections and activities
 *
 * @author Enric Soldevila
 */
const CourseNavigation = ({ onToggle, startsOpen }: { onToggle: () => void, startsOpen: boolean }) => {
	const { course, courseElements, setTab } = useContext(CourseContext);
	const { routes, goTo } = useRoutes();
	const { t } = useTranslation();

	if (!course) {
		goTo(routes.auth.dashboard.path);
		return <></>;
	}

	return (
		<Disclosure
			as="div"
			className="transition-all ease-in-out h-full w-full border-r border-[color:var(--bg-shade-four-color)]"
		>
			{({ open }) => (
					startsOpen ? (
						<>
							<div className="w-full py-3 text-2xl text-center flex justify-between">
								<span className="pl-5 pt-2">Sections</span>
								<div>
									<FontAwesomeIcon
										icon={faChalkboardTeacher}
										size="2x"
										className="pr-5 hover:cursor-pointer [color:var(--foreground-color)]"
										onClick={() =>
											setTab({ tab: 'layout', openedActivity: null })
										}
									/>
									<Disclosure.Button>
										<FontAwesomeIcon
											icon={faWindowMinimize}
											className="w-fit pb-2 mb-5 pr-1 hover:cursor-pointer [color:var(--foreground-color)]"
											onClick={() => {
												onToggle();
											}}
										/>
									</Disclosure.Button>
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
						</>
					) : (
						<Disclosure.Button as="div" className="flex flex-col items-center w-fit h-full">
							<FontAwesomeIcon
								icon={faWindowMaximize}
								size="2x"
								className="w-fit mt-1 pt-2 mb-4 hover:cursor-pointer [color:var(--foreground-color)]"
								onClick={() => {
									onToggle();
								}}
							/>
							<FontAwesomeIcon
								icon={faChalkboardTeacher}
								size="2x"
								className="w-fit mt-2 mb-1 px-1.5 hover:cursor-pointer [color:var(--foreground-color)]"
								onClick={() =>
									setTab({ tab: 'layout', openedActivity: null })
								}
							/>
						</Disclosure.Button>
					)
			)}
		</Disclosure>
	);
};

export default CourseNavigation;
