import { faDropbox } from '@fortawesome/free-brands-svg-icons';
import { faPenFancy, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Disclosure } from '@headlessui/react';
import { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity } from '../../../Models/Course/activity.entity';
import { Section } from '../../../Models/Course/section.entity';
import { CourseContext } from '../../../state/contexts/CourseContext';
import AlertConfirm from '../../UtilsComponents/Alert/AlertConfirm/AlertConfirm';
import Link from '../../UtilsComponents/Link/Link';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import { Option, TDOption } from '../../UtilsComponents/Option/TDOption';
import { CourseSectionProps } from '../CourseSection/courseSectionTypes';
import CourseLayoutElement from './CourseLayoutElement';
import CreateSectionForm from './CreateSectionForm';
/**
 * Component that shows the section in the navigation and handles different actions like adding in an activity onto the section
 *
 * @param {Section} section
 * @author MoSk3
 * @author Ecoral360
 */
const CourseSection = ({
	section,
	editMode,
	depth = 0,
}: CourseSectionProps) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const {
		deleteElement,
		courseElements,
		course,
		canEdit,
		loadSectionElements,
	} = useContext(CourseContext);
	const { t } = useTranslation();
	const [confirmSectionDelete, setConfirmSectionDelete] = useState(false);
	const [confirmActivityDelete, setConfirmActivityDelete] = useState(false);
	const currentActivity = useRef<Activity>();
	const [openModalSection, setOpenModalSection] = useState(false);

	const toggleOpenSection = async () => {
		if (!course) return;
		setOpen(!open);
		if (!open) {
			setLoading(true);
			await section.elements;
			setLoading(false);
		}
	};

	useEffect(() => {
		loadSectionElements(section);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [section]);

	return (
		<Disclosure as="div" className="course-section">
			<Disclosure.Button
				as="div"
				className="course-section-header"
				aria-controls={`section-${section.name}`}
				aria-expanded={open}
			>
				<div className="course-section-header-edit">
					<span onClick={toggleOpenSection}>{section.name}</span>
					{canEdit && editMode && (
						<TDOption color="black" size="1x">
							<Option name="Rename" icon={faPenFancy} onClick={() => {}} />
							<Option name="Move" icon={faDropbox} onClick={() => {}} />
							<Option
								name="Delete"
								icon={faTrash}
								onClick={() => setConfirmSectionDelete(true)}
								hoverColor="red"
							/>
						</TDOption>
					)}
				</div>
			</Disclosure.Button>
			<Disclosure.Panel>
				<div id={`section-${section.name}`} className="course-section-body">
					{loading && open && <LoadingScreen size="3x" relative />}

					{canEdit && (!section.elements || section.elements?.length === 0) ? (
						<Link
							dark
							onClick={() => {
								setOpenModalSection(true);
							}}
						>
							{t('course.section.new')}
						</Link>
					) : (
						<>
							{section.elementsOrder?.map(id => (
								<div key={id} className="course-activity">
									<CourseLayoutElement
										element={courseElements![id]}
										editMode={editMode}
										depth={depth + 1}
									/>
								</div>
							))}
							{canEdit && (
								<Link
									dark
									onClick={() => {
										setOpenModalSection(true);
									}}
								>
									{t('course.section.new')}
								</Link>
							)}
						</>
					)}
				</div>
			</Disclosure.Panel>
			<AlertConfirm
				open={confirmSectionDelete}
				title={t('couse.section.delete')}
				setOpen={setConfirmSectionDelete}
				onConfirm={() => {
					if (!(course && section)) return;
					deleteElement(section.courseElement);
				}}
				hideFooter
			></AlertConfirm>
			<AlertConfirm
				open={confirmActivityDelete}
				title={t('couse.activity.delete')}
				setOpen={setConfirmActivityDelete}
				onConfirm={() => {
					if (!(course && section && currentActivity.current)) return;
					deleteElement(currentActivity.current.course_element);
				}}
				hideFooter
			></AlertConfirm>
			<CreateSectionForm
				openModalSection={openModalSection}
				setOpenModalSection={setOpenModalSection}
				sectionParent={section}
			/>
		</Disclosure>
	);
};

export default CourseSection;
