import Draggable from '../../../UtilsComponents/Draggable/Draggable';
import { useMemo } from 'react';

function makeItem() {
	return (
		<Draggable draggedStyle="rotate-[30]">
			<div className=""></div>
		</Draggable>
	);
}

const QuickDropItems = ({}) => {
	const items = useMemo(() => {
		return [makeItem()];
	}, []);

	return <>{items}</>;
};

export default QuickDropItems;
