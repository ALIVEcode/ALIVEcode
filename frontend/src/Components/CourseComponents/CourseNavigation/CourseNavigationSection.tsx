import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Section } from '../../../Models/Course/section.entity';
import { CourseContext } from '../../../state/contexts/CourseContext';
import CourseNavigationElement from './CourseNavigationElement';
import { CourseNavigationSectionProps } from './courseNavigationTypes';
/**
 * Component that shows the section in the navigation and handles different actions like adding in an activity onto the section
 *
 * @param {Section} section
 * @author Enric Soldevila
 * @author Ecoral360
 */
const CourseNavigationSection = ({ element }: CourseNavigationSectionProps) => {
	const section = element.section as Section;
	const { courseElements, tab, setTab } = useContext(CourseContext);
	const { t } = useTranslation();

	const opened = useMemo(
		() => tab.openedSections.includes(element),
		[element, tab.openedSections],
	);

	return (
		<div>
			<div className="cursor-pointer group">
				<div
					className="flex justify-between p-3 pl-5 border-t border-l border-b border-[color:var(--bg-shade-four-color)]"
					onClick={() =>
						opened
							? setTab({ closeSection: element })
							: setTab({ openSection: element })
					}
				>
					<span>{element.name}</span>
					<FontAwesomeIcon
						className="group-hover:visible invisible opacity-40 mt-1"
						icon={opened ? faChevronDown : faChevronUp}
					/>
				</div>
			</div>
			{opened && (
				<div className="border-opacity-20 border-[color:grey] ml-7 text-sm border-double ">
					<>
						{section.elementsOrder.length === 0 && (
							<div className="py-2">
								<i>{t('course.section.empty')}</i>
							</div>
						)}
						{section.elementsOrder?.map(
							id =>
								courseElements?.current && (
									<CourseNavigationElement
										key={id}
										element={courseElements.current[id]}
									/>
								),
						)}
					</>
				</div>
			)}
		</div>
	);
};

export default CourseNavigationSection;
