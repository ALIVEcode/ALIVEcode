import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure } from '@headlessui/react';
import { useContext } from 'react';
import { Section } from '../../../Models/Course/section.entity';
import { CourseContext } from '../../../state/contexts/CourseContext';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import ButtonAddCourseElement from './ButtonAddCourseElement';
import CourseLayoutElement from './CourseLayoutElement';
import { CourseLayoutSectionProps } from './courseLayoutTypes';
/**
 * Component that shows the section in the navigation and handles different actions like adding in an activity onto the section
 *
 * @param {Section} section
 * @author MoSk3
 * @author Ecoral360
 */
const CourseLayoutSection = ({ courseElement }: CourseLayoutSectionProps) => {
	const section = courseElement.section as Section;
	const { courseElements, canEdit } = useContext(CourseContext);

	return (
		<Disclosure as="div" defaultOpen>
			{({ open }) => (
				<>
					<Disclosure.Button>
						<FontAwesomeIcon
							icon={open ? faCaretDown : faCaretUp}
							size="lg"
							className="mb-5 ml-6 [color:grey] "
						/>
					</Disclosure.Button>
					<Disclosure.Panel className="border-opacity-20 border-[color:grey] border-l ml-7 text-sm border-b">
						<div id={`section-${section.name}`}>
							{section.elementsOrder === undefined ? (
								<LoadingScreen size="3x" relative />
							) : (
								<></>
							)}
							{section.elementsOrder?.map(
								id =>
									courseElements?.current && (
										<CourseLayoutElement
											key={id}
											element={courseElements.current[id]}
										/>
									),
							)}
						</div>
						{canEdit && <ButtonAddCourseElement section={section} />}
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	);
};

export default CourseLayoutSection;
