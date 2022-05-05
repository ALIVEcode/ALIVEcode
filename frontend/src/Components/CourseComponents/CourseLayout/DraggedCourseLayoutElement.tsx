import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import CourseLayoutSection from './CourseLayoutSection';
import { CourseLayoutElementProps } from './courseLayoutTypes';
import { CourseElementSection } from '../../../Models/Course/course_element.entity';
import { classNames } from '../../../Types/utils';

/**
 * Component that wraps a CourseElement to show it properly on the layout view
 *
 * @param element The element wrapped
 *
 * @param className
 * @param isFantom
 * @author Mathis Laroche
 */
const DraggedCourseElement = ({
	element,
	className,
}: CourseLayoutElementProps) => {
	return (
		<div
			className={classNames('py-2 pl-2 laptop:pl-3 desktop:pl-4', className)}
		>
			<div className="group text-base flex items-center" onClick={() => {}}>
				<div>
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
						<div className="flex flex-row">
							<span className={'cursor-pointer'}>{element.name}</span>
						</div>
					</div>
					<div className="mr-2" />
				</div>
			</div>
			{element.section && (
				<CourseLayoutSection
					courseElement={element as CourseElementSection}
					isDragged
				/>
			)}
		</div>
	);
};

export default DraggedCourseElement;
