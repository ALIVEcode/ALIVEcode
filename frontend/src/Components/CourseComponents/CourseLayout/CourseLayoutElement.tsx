import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useRef, useState } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import CourseLayoutActivity from './CourseLayoutActivity';
import CourseLayoutSection from './CourseLayoutSection';
import { CourseLayoutElementProps } from './courseLayoutTypes';
import FormInput from '../../UtilsComponents/FormInput/FormInput';

/**
 *
 * @param element
 * @returns
 *
 * @author Mathis Laroche
 */
const CourseLayoutElement = ({ element }: CourseLayoutElementProps) => {
	const { renameElement } = useContext(CourseContext);
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
	const rename = async () => {
		setIsRenaming(false);
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
				<div className="ml-2 py-3 rounded-sm border p-[0.2rem] border-[color:var(--bg-shade-four-color)] text-[color:var(--foreground-color)] flex items-center w-full">
					{!isRenaming ? (
						<span
							onDoubleClick={() => setIsRenaming(true)}
							className="pl-2 cursor-pointer"
						>
							{element.name}
						</span>
					) : (
						<FormInput
							ref={inputRef as any}
							type="text"
							autoFocus
							onKeyPress={(event: KeyboardEvent) =>
								event.key.toLowerCase() === 'enter' && rename()
							}
							onBlur={rename}
							onDoubleClick={rename}
							className="pl-2 bg-[color:var(--background-color)] w-full"
							defaultValue={element.name}
						/>
					)}
				</div>
			</div>
			{element?.section ? (
				<CourseLayoutSection courseElement={element} />
			) : element?.activity ? (
				<CourseLayoutActivity courseElement={element} />
			) : (
				<div>ERREUR</div>
			)}
		</div>
	);
};

export default CourseLayoutElement;
