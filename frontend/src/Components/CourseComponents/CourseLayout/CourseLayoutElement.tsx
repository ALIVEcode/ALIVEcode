import {
	faBars,
	faEye,
	faEyeSlash,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CourseContext } from '../../../state/contexts/CourseContext';
import AlertConfirm from '../../UtilsComponents/Alert/AlertConfirm/AlertConfirm';
import FormInput from '../../UtilsComponents/FormInput/FormInput';
import CourseLayoutActivity from './CourseLayoutActivity';
import CourseLayoutSection from './CourseLayoutSection';
import { CourseLayoutElementProps } from './courseLayoutTypes';
import {
	CourseElementActivity,
	CourseElementSection,
} from '../../../Models/Course/course_element.entity';
import { classNames } from '../../../Types/utils';

/**
 * Component that wraps a CourseElement to show it properly on the layout view
 *
 * @param element The element wrapped
 *
 * @author Mathis Laroche
 */
const CourseLayoutElement = ({ element }: CourseLayoutElementProps) => {
	const {
		renameElement,
		deleteElement,
		isNewCourseElement,
		setCourseElementNotNew,
		courseElements,
		moveElement,
		setIsElementVisible,
	} = useContext(CourseContext);
	const { t } = useTranslation();
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [isRenaming, setIsRenaming] = useState(false);
	const inputRef = useRef<HTMLInputElement>();
	const courseLayoutElementRef = useRef<HTMLDivElement>(null);

	/**
	 * Handles the renaming of an element
	 *
	 * @author Mathis Laroche
	 */
	const rename = async () => {
		if (isNewCourseElement(element)) {
			setCourseElementNotNew(element);
		}
		if (isRenaming) {
			setIsRenaming(false);
		}
		if (
			inputRef.current?.value &&
			inputRef.current.value.trim() !== element.name
		) {
			await renameElement(element, inputRef.current.value.trim());
		}
	};

	const onDragStart = useCallback(
		(event: React.DragEvent<HTMLDivElement | SVGElement>) => {
			event.dataTransfer.setData('text/plain', element.id.toString());
			if (!courseLayoutElementRef.current) {
				return;
			}
			event.dataTransfer.setDragImage(courseLayoutElementRef.current, 25, 40);
			console.log('drag start');
		},
		[element],
	);

	const onDragOver = useCallback(
		(event: React.DragEvent<HTMLDivElement | SVGElement>) => {
			event.preventDefault();
		},
		[],
	);

	const onDrop = useCallback(
		async (event: React.DragEvent<HTMLDivElement | SVGElement>) => {
			event.preventDefault();
			const data = event.dataTransfer.getData('text/plain');
			if (data === '') return;
			if (!courseElements?.current) return;
			if (!(data in courseElements.current)) return;

			const id = Number(data);
			if (id === element.id) return;

			const draggedElement = courseElements.current[id];

			await moveElement(
				draggedElement,
				element.parent.elementsOrder.findIndex(id => id === element.id),
				element.parent,
			);
		},
		[courseElements, element, moveElement],
	);

	return (
		<div
			className={classNames(
				'py-2 pl-2 laptop:pl-3 desktop:pl-4',
				!element.isVisible && 'opacity-50',
			)}
			ref={courseLayoutElementRef}
			onDrop={e => {
				e.preventDefault();
				e.stopPropagation();
				onDrop(e);
			}}
		>
			<div className="group text-base flex items-center" onClick={() => {}}>
				<div
					draggable
					onDragStart={e => onDragStart(e)}
					onDragOver={e => onDragOver(e)}
				>
					<FontAwesomeIcon
						icon={faBars}
						size="lg"
						className="text-[color:var(--foreground-color)] transition-all duration-75
					group-hover:cursor-grab group-hover:opacity-50 opacity-0"
					/>
				</div>
				<div
					className="ml-2 py-3 rounded-sm border p-[0.2rem]
				border-[color:var(--bg-shade-four-color)] text-[color:var(--foreground-color)]
				flex items-center w-full justify-between"
				>
					<div className="flex flex-row">
						{element?.activity && element?.icon ? (
							<FontAwesomeIcon
								icon={element.icon}
								className="[color:var(--bg-shade-four-color)] mr-3 ml-2 mt-1"
							/>
						) : (
							<span className="invisible pl-3" />
						)}
						{isRenaming || isNewCourseElement(element) ? (
							<FormInput
								ref={inputRef as any}
								type="text"
								autoFocus
								onKeyPress={(event: KeyboardEvent) =>
									event.key.toLowerCase() === 'enter' && rename()
								}
								onFocus={() => {
									setIsRenaming(true);
								}}
								onBlur={rename}
								className="bg-[color:var(--background-color)] w-full"
								defaultValue={element.name}
							/>
						) : (
							<div className="flex flex-row">
								<span
									onClick={() => setIsRenaming(true)}
									className={'cursor-pointer'}
								>
									{element.name}
								</span>
								{element.activity && (
									<div className="invisible group-hover:visible">
										<CourseLayoutActivity
											courseElement={element as CourseElementActivity}
										/>
									</div>
								)}
							</div>
						)}
					</div>
					<div className="flex flex-row">
						<FontAwesomeIcon
							icon={element.isVisible ? faEye : faEyeSlash}
							size="lg"
							className="[color:var(--bg-shade-four-color)] mr-4 hover:[color:var(--fg-shade-one-color)]
							cursor-pointer invisible group-hover:visible transition-all duration-75 ease-in"
							onClick={() => setIsElementVisible(element, !element.isVisible)}
						/>
						<FontAwesomeIcon
							icon={faTrash}
							size="lg"
							className="[color:var(--bg-shade-four-color)] mr-2 hover:[color:red]
							cursor-pointer invisible group-hover:visible transition-all duration-75 ease-in"
							onClick={() => setConfirmDelete(true)}
						/>
					</div>
				</div>
			</div>
			{element.section && (
				<CourseLayoutSection courseElement={element as CourseElementSection} />
			)}
			<AlertConfirm
				open={confirmDelete}
				title={
					element.isActivity
						? t('course.activity.delete')
						: t('course.section.delete')
				}
				setOpen={setConfirmDelete}
				onConfirm={async () => {
					await deleteElement(element);
				}}
				hideFooter
			>
				<p className="text-red-600 pb-5 font-bold text-lg">
					{t('action.irreversible')}
				</p>
			</AlertConfirm>
		</div>
	);
};

export default CourseLayoutElement;
