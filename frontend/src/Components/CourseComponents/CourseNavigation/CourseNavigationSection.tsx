import { Disclosure } from '@headlessui/react';
import { useContext, useState } from 'react';
import { Section } from '../../../Models/Course/section.entity';
import { CourseContext } from '../../../state/contexts/CourseContext';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import { CourseNavigationSectionProps } from './courseNavigationTypes';
import CourseNavigationElement from './CourseNavigationElement';
/**
 * Component that shows the section in the navigation and handles different actions like adding in an activity onto the section
 *
 * @param {Section} section
 * @author MoSk3
 * @author Ecoral360
 */
const CourseNavigationSection = ({
	courseElement,
}: CourseNavigationSectionProps) => {
	const section = courseElement.section as Section;
	const [open, setOpen] = useState(true);
	const [loading, setLoading] = useState(false);
	const { courseElements } = useContext(CourseContext);

	return (
		<Disclosure as="div" defaultOpen>
			<Disclosure.Panel className="border-opacity-20 border-[color:grey] ml-7 text-sm  border-double ">
				<div id={`section-${section.name}`}>
					{loading && open && <LoadingScreen size="3x" relative />}
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
		</Disclosure>
	);
};

export default CourseNavigationSection;
