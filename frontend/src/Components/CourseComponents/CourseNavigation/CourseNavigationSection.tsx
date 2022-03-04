import { Disclosure } from '@headlessui/react';
import { useContext } from 'react';
import { Section } from '../../../Models/Course/section.entity';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { CourseNavigationSectionProps } from './courseNavigationTypes';
import CourseNavigationElement from './CourseNavigationElement';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
/**
 * Component that shows the section in the navigation and handles different actions like adding in an activity onto the section
 *
 * @param {Section} section
 * @author MoSk3
 * @author Ecoral360
 */
const CourseNavigationSection = ({ element }: CourseNavigationSectionProps) => {
	const section = element.section as Section;
	const { courseElements } = useContext(CourseContext);
	const { t } = useTranslation();

	return (
		<Disclosure as="div">
			{({ open }) => (
				<>
					<div className="flex justify-between p-3 border-t border-l border-b border-[color:var(--bg-shade-four-color)]">
						<div>
							<span>{element.name}</span>
						</div>
						<Disclosure.Button as="div">
							<FontAwesomeIcon
								className="cursor-pointer"
								icon={open ? faChevronDown : faChevronUp}
							/>
						</Disclosure.Button>
					</div>
					<Disclosure.Panel className="border-opacity-20 border-[color:grey] ml-7 text-sm  border-double ">
						<div>
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
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
};

export default CourseNavigationSection;
