import { ResourceFilterProps } from './resourceFilterTypes';
import { useContext } from 'react';
import { ResourceMenuContext } from '../../../state/contexts/ResourceContext';
import { classNames } from '../../../Types/utils';

export const ResourceFilter = ({ name, filter }: ResourceFilterProps) => {
	const { isFilterSelected, toggleFilter } = useContext(ResourceMenuContext);

	return (
		<div
			className={classNames(
				'w-32 rounded-full block border border-[color:var(--bg-shade-four-color)] p-2 mr-2 cursor-pointer',
				isFilterSelected(filter)
					? 'bg-[color:var(--fg-shade-four-color)] text-[color:var(--background-color)]'
					: 'hover:bg-[color:var(--bg-shade-one-color)]',
			)}
			onClick={() => toggleFilter(filter)}
		>
			<div className="text-center text-sm">{name}</div>
		</div>
	);
};
