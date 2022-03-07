import { faBars, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CourseContext } from '../../../state/contexts/CourseContext';
import AlertConfirm from '../../UtilsComponents/Alert/AlertConfirm/AlertConfirm';
import FormInput from '../../UtilsComponents/FormInput/FormInput';
import CourseLayoutActivity from './CourseLayoutActivity';
import CourseLayoutSection from './CourseLayoutSection';
import { CourseLayoutElementProps } from './courseLayoutTypes';

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
	} = useContext(CourseContext);
	const { t } = useTranslation();
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [isRenaming, setIsRenaming] = useState(false);
	const inputRef = useRef<HTMLInputElement>();

	// useEffect(() => {
	// 	if (!element?.section || !courseElements?.current) return;

	// 	const noReload = element.section.elementsOrder.every(id => {
	// 		return id in courseElements.current;
	// 	});

	// 	if (noReload) return;

	// 	console.log(`reloading section ${element.name}`);
	// 	loadSectionElements(element.section);
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [element, courseElements]);

	/**
	 * Handles the renaming of an element
	 *
	 * @author Mathis
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

	return (
		<div className="py-2 pl-2 laptop:pl-3 desktop:pl-4">
			<div className="group text-base flex items-center">
				<FontAwesomeIcon
					icon={faBars}
					size="lg"
					className="text-[color:var(--foreground-color)] transition-all duration-75 group-hover:cursor-grab group-hover:opacity-50 opacity-0"
				/>
				<div className="ml-2 py-3 rounded-sm border p-[0.2rem] border-[color:var(--bg-shade-four-color)] text-[color:var(--foreground-color)] flex items-center w-full justify-between">
					<div className="">
						{element?.icon && (
							<FontAwesomeIcon
								icon={element.icon}
								className="[color:var(--bg-shade-four-color)] mr-3 ml-2"
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
								onDoubleClick={rename}
								className="bg-[color:var(--background-color)] w-full"
								defaultValue={element.name}
							/>
						) : (
							<span
								onDoubleClick={() => setIsRenaming(true)}
								className=" cursor-pointer"
							>
								{element.name}
							</span>
						)}
					</div>
					<div>
						<FontAwesomeIcon
							icon={faTrash}
							size="lg"
							className="[color:var(--bg-shade-four-color)] mr-2 hover:[color:red] cursor-pointer invisible group-hover:visible transition-all duration-75 ease-in"
							onClick={() => setConfirmDelete(true)}
						/>
					</div>
				</div>
			</div>
			{element?.section ? (
				<CourseLayoutSection courseElement={element} />
			) : element?.activity ? (
				<CourseLayoutActivity courseElement={element} />
			) : (
				<div>ERREUR</div>
			)}
			<AlertConfirm
				open={confirmDelete}
				title={t('couse.section.delete')}
				setOpen={setConfirmDelete}
				onConfirm={async () => {
					await deleteElement(element);
				}}
				hideFooter
			/>
		</div>
	);
};

export default CourseLayoutElement;
