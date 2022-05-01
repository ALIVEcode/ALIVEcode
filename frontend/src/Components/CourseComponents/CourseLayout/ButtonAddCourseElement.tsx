import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Popup from 'reactjs-popup';
import { CourseContext } from '../../../state/contexts/CourseContext';
import { ButtonAddCourseElementProps } from './courseLayoutTypes';
import { Section } from '../../../Models/Course/section.entity';
import { plainToClass } from 'class-transformer';

/**
 * Component of a button that allows the creation of a new section or a new activity
 *
 * @param section the section in which the button lies
 * @author Mathis Laroche
 */
const ButtonAddCourseElement = ({ section }: ButtonAddCourseElementProps) => {
	const { openActivityForm, addContent, courseElements } =
		useContext(CourseContext);
	const { t } = useTranslation();
	const [popupOpen, setPopupOpen] = useState(false);
	return (
		<Popup
			trigger={
				<div
					className="border p-2 ml-10 desktop:ml-11 border-[color:var(--bg-shade-four-color)] text-[color:var(--foreground-color)] mt-2 border-opacity-25 w-24 hover:cursor-pointer"
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
					// onDrop={async event => {
					// 	event.preventDefault();
					// 	const data = event.dataTransfer.getData('text/plain');
					// 	if (data === '') return;
					// 	if (!courseElements?.current) return;
					// 	if (!(data in courseElements.current)) return;
					//
					// 	const id = Number(data);
					//
					// 	const draggedElement = courseElements.current[id];
					//
					// 	const parent = section ?? course;
					// 	if (!parent) return;
					//
					// 	if (parent.elementsOrder.at(-1) === id) return;
					//
					// 	await moveElement(
					// 		draggedElement,
					// 		parent.elementsOrder.length - 1,
					// 		parent,
					// 	);
					// }}
				>
					<FontAwesomeIcon
						icon={faPlus}
						className="[color:var(--logo-color)]"
					/>
				</div>
			}
			position="top center"
			closeOnDocumentClick
			onOpen={_ => setPopupOpen(true)}
			open={popupOpen}
			closeOnEscape
			contentStyle={{
				width: '200px',
				display: 'flex',
				flexDirection: 'column',
				background: 'var(--background-color)',
				border: 'solid 1px',
				borderColor: 'var(--bg-shade-four-color)',
				borderRadius: '0.5rem',
			}}
			arrowStyle={{
				color: 'var(--bg-shade-four-color)',
				bottom: '2px',
			}}
		>
			<div className="text-[color:var(--logo-color)] text-center">
				<div
					className="p-2 border-b border-[color:var(--bg-shade-four-color)] cursor-pointer rounded-t-lg transition-all hover:bg-[color:var(--bg-shade-one-color)]"
					onClick={async () => {
						const newSection: Section = plainToClass(Section, {});
						if (courseElements) {
							let sectionNb = 0;
							Object.values(courseElements.current).forEach(el => {
								if (el.isSection) sectionNb++;
							});
							await addContent(
								newSection,
								t('course.section.new_name', { num: sectionNb + 1 }),
								section,
							);
						}
						setPopupOpen(false);
					}}
				>
					{t('course.section.new')}
				</div>
				<div
					className="p-2 cursor-pointer rounded-b-lg transition-all hover:bg-[color:var(--bg-shade-one-color)]"
					onClick={() => {
						openActivityForm(section);
						setPopupOpen(false);
					}}
				>
					{t('course.activity.new')}
				</div>
			</div>
		</Popup>
	);
};

export default ButtonAddCourseElement;
