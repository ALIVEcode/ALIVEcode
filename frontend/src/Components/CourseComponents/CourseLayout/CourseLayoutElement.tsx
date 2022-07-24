import {
	faBars,
	faEye,
	faEyeSlash,
	faFolderOpen,
	faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {
	ForwardedRef,
	useCallback,
	useContext,
	useRef,
	useState,
} from 'react';
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
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { useForceUpdate } from '../../../state/hooks/useForceUpdate';
import useView from '../../../state/hooks/useView';

/**
 * Component that wraps a CourseElement to show it properly on the layout view
 *
 * @param element The element wrapped
 *
 * @author Mathis Laroche
 */
const CourseLayoutElement = React.forwardRef(
	(
		{ element }: CourseLayoutElementProps,
		openedActivityRef: ForwardedRef<HTMLDivElement>,
	) => {
		const {
			renameElement,
			deleteElement,
			isNewCourseElement,
			setCourseElementNotNew,
			courseElements,
			moveElement,
			setIsElementVisible,
			tab,
		} = useContext(CourseContext);
		const { t } = useTranslation();
		const [confirmDelete, setConfirmDelete] = useState(false);
		const [isRenaming, setIsRenaming] = useState(false);
		const view = useView();
		const inputRef = useRef<HTMLInputElement>();
		const courseLayoutElementRef = useRef<HTMLDivElement>(null);
		const forceUpdate = useForceUpdate();

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
			(event: React.DragEvent<HTMLDivElement>) => {
				event.dataTransfer.setData('text/plain', element.id.toString());
				if (!courseLayoutElementRef.current) {
					return;
				}
				courseLayoutElementRef.current.style.opacity = '0.5';
				event.dataTransfer.setDragImage(courseLayoutElementRef.current, 25, 40);
				console.log('drag start');
			},
			[element],
		);

		const onDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			if (!courseLayoutElementRef.current) {
				return;
			}
			courseLayoutElementRef.current.style.opacity = '1';
		};

		const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
			event.preventDefault();
		}, []);

		const onDrop = useCallback(
			async (event: React.DragEvent<HTMLDivElement>) => {
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

		const onDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
			// const target = event.target as HTMLElement;
			// const parent = getParent(target);
			// if (!parent) return;
			// event.preventDefault();
			// event.stopPropagation();
			// parent.style.borderBottom = '2px solid cyan';
		};

		const onDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
			// const target = event.target as HTMLElement;
			// const parent = getParent(target);
			// if (!parent) return;
			// event.preventDefault();
			// event.stopPropagation();
			// parent.style.borderBottom = '';
		};

		return (
			<div
				className={classNames(
					'py-1 pl-2 laptop:pl-3 desktop:pl-4',
					!element.isVisible && 'opacity-50',
				)}
				ref={courseLayoutElementRef}
				onDrop={async e => {
					e.preventDefault();
					e.stopPropagation();
					await onDrop(e);
				}}
				onDragEnter={e => onDragEnter(e)}
				onDragLeave={e => onDragLeave(e)}
				onDragOver={e => onDragOver(e)}
				onDragEnd={e => onDragEnd(e)}
			>
				<div className="group text-xs tablet:text-sm tracking-wide flex items-center">
					<div draggable onDragStart={e => onDragStart(e)}>
						<FontAwesomeIcon
							icon={faBars}
							size="lg"
							className="text-[color:var(--foreground-color)] transition-all duration-75
					group-hover:cursor-grab group-hover:opacity-50 opacity-0"
						/>
					</div>
					<div
						className="ml-1 tablet:ml-2 py-[0.6rem] tablet:py-3 rounded-md border p-[0.2rem]
				border-[color:var(--bg-shade-four-color)] text-[color:var(--foreground-color)]
				flex items-center w-full justify-between"
					>
						<div className="flex flex-row items-center">
							{element?.activity && element?.icon ? (
								<FontAwesomeIcon
									icon={element.icon}
									style={{
										color: element.activity.color,
										fontSize: view.screenType === 'phone' ? '1.2em' : '1.5em',
									}}
									title={t(`help.activity.${element.activity.type}`)}
									className="mx-2 tablet:mx-3"
								/>
							) : (
								<FontAwesomeIcon
									icon={element.section?.opened ? faFolderOpen : faFolder}
									style={{
										fontSize: '1.5em',
									}}
									className="mx-2 tablet:mx-3"
								/>
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
												ref={
													element.id === tab.openedActivity?.id
														? openedActivityRef
														: null
												}
												courseElement={element as CourseElementActivity}
											/>
										</div>
									)}
								</div>
							)}
						</div>
						<div className="flex flex-row gap-2 mr-2">
							<FontAwesomeIcon
								icon={element.isVisible ? faEye : faEyeSlash}
								size="lg"
								className="[color:var(--bg-shade-four-color)] hover:[color:var(--fg-shade-one-color)]
							cursor-pointer invisible group-hover:visible transition-all duration-75 ease-in"
								onClick={() => setIsElementVisible(element, !element.isVisible)}
							/>
							<FontAwesomeIcon
								icon={faTrash}
								size="lg"
								className="[color:var(--bg-shade-four-color)] hover:[color:red]
							cursor-pointer invisible group-hover:visible transition-all duration-75 ease-in"
								onClick={() => setConfirmDelete(true)}
							/>
						</div>
					</div>
				</div>
				{element.section && (
					<CourseLayoutSection
						ref={openedActivityRef}
						courseElement={element as CourseElementSection}
						forceUpdateLayoutElement={forceUpdate}
					/>
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
					irreversibleText
				/>
			</div>
		);
	},
);

export default CourseLayoutElement;
