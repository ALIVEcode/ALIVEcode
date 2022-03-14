import React from 'react';
import { CreationMenuProps } from './creationMenuProps';
import Modal from '../../UtilsComponents/Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { classNames } from '../../../Types/utils';
import {
	faChevronLeft,
	faChevronRight,
	faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Generic Creation Menu for future elements creation
 * @param children The children to render inside the component
 * @returns The Creation menu
 *
 * @author Enric Soldevila
 */
const CreationMenu: React.FC<CreationMenuProps> = ({
	children: childrenProp,
	title,
	open,
	setOpen,
	onSubmit,
}) => {
	const [pageNb, setPageNb] = useState(0);
	const [children, setChildren] = useState<React.ReactNode[]>([]);
	useEffect(() => {
		if (!Array.isArray(childrenProp)) return setChildren([childrenProp]);
		setChildren(childrenProp);
	}, [childrenProp]);

	/**
	 */
	const generatePages = () => {
		const currentChild = children[pageNb];
		const isLastPage = pageNb === children.length - 1;
		const isFirstPage = pageNb === 0;

		return (
			<div className="w-full h-full flex flex-row items-center justify-evenly gap-4">
				<div
					className={classNames(
						'flex items-center',
						isFirstPage ? 'opacity-0' : 'cursor-pointer',
					)}
					onClick={() => pageNb !== 0 && setPageNb(pageNb - 1)}
				>
					<FontAwesomeIcon size="2x" icon={faChevronLeft}></FontAwesomeIcon>
				</div>
				<div className="p-12 w-full">{currentChild}</div>
				<div
					className={classNames(
						'flex items-center cursor-pointer',
						isLastPage ? '' : '',
					)}
					onClick={() => (isLastPage ? onSubmit() : setPageNb(pageNb + 1))}
				>
					<FontAwesomeIcon
						size="2x"
						icon={isLastPage ? faPlusCircle : faChevronRight}
					></FontAwesomeIcon>
				</div>
			</div>
		);
	};

	return (
		<Modal
			size="xl"
			title={title}
			open={open}
			setOpen={setOpen}
			closeCross
			hideFooter
		>
			{generatePages()}
		</Modal>
	);
};

export default CreationMenu;
