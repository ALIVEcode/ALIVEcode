import { faDropbox } from '@fortawesome/free-brands-svg-icons';
import {
	faPenFancy,
	faSmileWink,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Disclosure } from '@headlessui/react';
import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Activity } from '../../../Models/Course/activity.entity';
import { Section } from '../../../Models/Course/section.entity';
import { CourseContext } from '../../../state/contexts/CourseContext';
import IconButton from '../../DashboardComponents/IconButton/IconButton';
import AlertConfirm from '../../UtilsComponents/Alert/AlertConfirm/AlertConfirm';
import Link from '../../UtilsComponents/Link/Link';
import LoadingScreen from '../../UtilsComponents/LoadingScreen/LoadingScreen';
import { Option, TDOption } from '../../UtilsComponents/Option/TDOption';
import { CourseSectionProps } from '../CourseSection/courseSectionTypes';
import CreateSectionForm from '../CourseSection/CreateSectionForm';
import CourseLayoutElement from './CourseLayoutElement';
/**
 * Component that shows the section in the navigation and handles different actions like adding in an activity onto the section
 *
 * @param {Section} section
 * @author MoSk3
 * @author Ecoral360
 */
const CourseLayoutSection = ({
	courseElement,
	editMode,
	depth = 0,
}: CourseSectionProps) => {
	const section = courseElement.section as Section;
	const [open, setOpen] = useState(true);
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
		// if (!open) {
		// 	setLoading(true);
		// 	await section.elements;
		// 	setLoading(false);
		// }
	};

	return (
		<Disclosure as="div" className="pb-[15px] pt-[15px]" defaultOpen>
			<Disclosure.Button
				as="div"
				className="peer text-base p-[5px] border-2 border-[color:var(--bg-shade-four-color)] text-[color:var(--foreground-color)] flex items-center"
				aria-controls={`section-${section.name}`}
				aria-expanded={open}
			>
				<div className="border-r-2 pr-2 border-[color:var(--bg-shade-four-color)]">
					<IconButton icon={faSmileWink} />
				</div>

				<span className="pl-2" onClick={toggleOpenSection}>
					{section.name}
				</span>
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
			</Disclosure.Button>
			<Disclosure.Panel className="text-sm border-[1px] border-transparent border-dashed border-opacity-80 peer-hover:border-[color:var(--bg-shade-four-color)] hover:border-[color:var(--bg-shade-four-color)] w-[100%]">
				<div id={`section-${section.name}`}>
					{loading && open && <LoadingScreen size="3x" relative />}

					<div className="">
						{section.elementsOrder?.map(
							id =>
								courseElements?.current && (
									<CourseLayoutElement
										key={id}
										element={courseElements.current[id]}
										editMode={editMode}
										depth={depth + 1}
									/>
								),
						)}
					</div>
					{canEdit && (
						<Link
							dark
							onClick={() => {
								setOpenModalSection(true);
							}}
							style={{ marginLeft: `${20 * (depth + 1)}px` }}
						>
							{t('course.section.new')}
						</Link>
					)}
				</div>
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
			<CreateSectionForm
				openModalSection={openModalSection}
				setOpenModalSection={setOpenModalSection}
				sectionParent={section}
			/>
		</Disclosure>
	);
};

export default CourseLayoutSection;
