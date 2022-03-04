import { Disclosure } from '@headlessui/react';
import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity } from '../../../Models/Course/activity.entity';
import { Section } from '../../../Models/Course/section.entity';
import { CourseContext } from '../../../state/contexts/CourseContext';
import AlertConfirm from '../../UtilsComponents/Alert/AlertConfirm/AlertConfirm';
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
	const [open, setOpen] = useState(true);
	const [loading, setLoading] = useState(false);
	const { deleteElement, courseElements, course, canEdit } =
		useContext(CourseContext);
	const { t } = useTranslation();
	const [confirmSectionDelete, setConfirmSectionDelete] = useState(false);
	const [confirmActivityDelete, setConfirmActivityDelete] = useState(false);
	const currentActivity = useRef<Activity>();

	return (
		<Disclosure as="div" defaultOpen>
			<Disclosure.Panel className="border-opacity-20 border-[color:grey] border-l ml-7 text-sm ">
				<div id={`section-${section.name}`}>
					{loading && open && <LoadingScreen size="3x" relative />}
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
			<AlertConfirm
				open={confirmSectionDelete}
				title={t('couse.section.delete')}
				setOpen={setConfirmSectionDelete}
				onConfirm={() => {
					if (!course) return;
					deleteElement(courseElement);
				}}
				hideFooter
			></AlertConfirm>
			<AlertConfirm
				open={confirmActivityDelete}
				title={t('couse.activity.delete')}
				setOpen={setConfirmActivityDelete}
				onConfirm={() => {
					if (!(course && section && currentActivity.current)) return;
					deleteElement(currentActivity.current.courseElement);
				}}
				hideFooter
			></AlertConfirm>
		</Disclosure>
	);
};

export default CourseLayoutSection;
