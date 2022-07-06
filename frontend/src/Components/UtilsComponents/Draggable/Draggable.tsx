import React, { ReactNode, useRef, useState } from 'react';
import { classNames } from '../../../Types/utils';

const Draggable = ({
	children,
	draggedStyle,
	onDrop,
}: {
	children: ReactNode;
	draggedStyle?: string;
	onDrop?: (event: React.DragEvent<HTMLDivElement>) => void;
}) => {
	const [dragged, setDragged] = useState(false);
	const draggedDivRef = useRef<HTMLDivElement>(null);

	return (
		<div
			className={
				dragged ? 'w-full h-full fixed left-0 top-0 flex z-[1000]' : ''
			}
		>
			<div
				className={classNames(
					'w-fit h-fit',
					dragged ? 'absolute cursor-grabbing' : 'cursor-grab',
					dragged && draggedStyle,
				)}
				ref={draggedDivRef}
				onDragEnd={event => {
					setDragged(false);
					onDrop && onDrop(event);
				}}
				onDrag={event => {
					setDragged(true);
					if (draggedDivRef.current) {
						draggedDivRef.current.style.left = `${
							event.clientX - draggedDivRef.current.clientWidth / 2
						}px`;
						draggedDivRef.current.style.top = `${
							event.clientY - draggedDivRef.current.clientHeight / 2
						}px`;
					}
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default Draggable;
