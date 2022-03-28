import { ResourceFilterProps } from './resourceFilterTypes';
import { useContext } from 'react';
import { ResourceMenuContext } from '../../../state/contexts/ResourceContext';
import { classNames } from '../../../Types/utils';

export const ResourceFilter = ({ name, filter }: ResourceFilterProps) => {
	const { mode, isFilterSelected, toggleFilter } =
		useContext(ResourceMenuContext);

	return (
		<div
			className={classNames(
				'w-32 rounded-full block border border-[color:var(--bg-shade-four-color)] p-2 mr-2',
				isFilterSelected(filter)
					? 'bg-[color:var(--fg-shade-four-color)] text-[color:var(--background-color)]'
					: mode !== 'import' && 'hover:bg-[color:var(--bg-shade-one-color)]',
				mode === 'import' ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
			)}
			onClick={() => mode !== 'import' && toggleFilter(filter)}
		>
			<div className="text-center text-sm">{name}</div>
		</div>
	);
};
