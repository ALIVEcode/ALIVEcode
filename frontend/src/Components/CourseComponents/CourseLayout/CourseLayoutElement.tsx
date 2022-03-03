import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure } from '@headlessui/react';
import { useContext, useRef, useState } from 'react';
import { CourseContext } from '../../../state/contexts/CourseContext';
import CourseLayoutActivity from './CourseLayoutActivity';
import CourseLayoutSection from './CourseLayoutSection';
import { CourseLayoutElementProps } from './courseLayoutTypes';

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
		<Disclosure
			as="div"
			className="pb-[15px] pt-[15px] lg:pl-[30px] md:pl-[20px] sm:pl-[10px]"
			defaultOpen
		>
			<div className="group text-base flex items-center">
				<FontAwesomeIcon
					icon={faBars}
					size="lg"
					className="[color:var(--foreground-color)] opacity-50 group-hover:cursor-grab group-hover:visible invisible"
				/>
				<div className="ml-2 border-2 p-[0.2rem] border-[color:var(--bg-shade-four-color)] text-[color:var(--foreground-color)] flex items-center w-[100%]">
					{!isRenaming ? (
						<span
							onDoubleClick={() => setIsRenaming(true)}
							className="pl-2 w-[100%]"
						>
							{element.name}
						</span>
					) : (
						<input
							ref={inputRef as any}
							type="text"
							autoFocus
							onKeyPress={event =>
								event.key.toLowerCase() === 'enter' && rename()
							}
							onBlur={rename}
							onDoubleClick={rename}
							className="pl-2 bg-[color:var(--background-color)] w-[100%]"
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
		</Disclosure>
	);
};

export default CourseLayoutElement;
