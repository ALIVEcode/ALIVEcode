import { ResourceSectionProps } from './resourceSectionTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { ResourceMenuContext } from '../../../state/contexts/ResourceContext';
import { classNames } from '../../../Types/utils';

export const ResourceSection = ({
	icon,
	name,
	section,
}: ResourceSectionProps) => {
	const { selectedSubject, setSelectedSubject } =
		useContext(ResourceMenuContext);

	return (
		<div
			className={classNames(
				'w-full aspect-[4/3] flex flex-col items-center justify-center border-b border-[color:var(--bg-shade-four-color)] gap-4 cursor-pointer transition-colors duration-75',
				selectedSubject === section && 'bg-[color:var(--bg-shade-three-color)]',
				selectedSubject !== section &&
					'hover:bg-[color:var(--bg-shade-one-color)]',
			)}
			onClick={() => setSelectedSubject(section)}
		>
			<div>
				<FontAwesomeIcon size="2x" icon={icon}></FontAwesomeIcon>
			</div>
			<div className="text-center text-xs">{name}</div>
		</div>
	);
};
