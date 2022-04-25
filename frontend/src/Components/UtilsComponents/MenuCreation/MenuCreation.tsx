import { MenuCreationProps, flattenChildren } from './menuCreationProps';
import Modal from '../Modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect } from 'react';
import { classNames } from '../../../Types/utils';
import {
	faChevronLeft,
	faChevronRight,
	faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Generic Creation Menu for future elements creation. Handles pagination,
 * navigation buttons and submit.
 *
 * @param children The children to render inside the component
 * @param title The title of the menu
 * @param open state of the menu
 * @param setOpen the state handler of the menu
 * @param onSubmit callback called when the plus button at the end of the menu is pressed
 * @param defaultPageNb initial rendered page when the menu is first rendered
 * @param submitIcon the icon at the last page to confirm the creation
 * @param disabledPageIndex the index of a disabled page. For example, 1 would block the navigation from page 0 -> 1
 * @returns The Creation menu
 * @author Enric Soldevila
 */
const MenuCreation: React.FC<MenuCreationProps> = ({
	children: childrenProp,
	title,
	open,
	setOpen,
	onSubmit,
	defaultPageNb,
	submitIcon,
	disabledPageIndex,
}) => {
	const [pageNb, setPageNb] = useState(defaultPageNb ?? 0);
	const [children, setChildren] = useState<React.ReactNode[]>([]);
	useEffect(() => {
		setChildren(flattenChildren(childrenProp));
	}, [childrenProp]);

	/**
	 * Renders the current opened page (React child) depending
	 * on the page index. Also handle arrows to navigate between
	 * pages.
	 */
	const renderPage = () => {
		const currentChild = children[pageNb];
		const isLastPage = pageNb === children.length - 1;
		const isFirstPage = pageNb === 0;
		const isPreviousPageDisabled =
			isFirstPage || disabledPageIndex === pageNb - 1;
		const isNextPageDisabled = disabledPageIndex === pageNb + 1;

		return (
			<div className="w-full h-full flex flex-row items-center justify-evenly gap-4">
				<div
					className={classNames(
						'flex items-center',
						isFirstPage ? 'opacity-0' : 'cursor-pointer',
						!isFirstPage && isPreviousPageDisabled && 'opacity-30',
					)}
					onClick={() => !isPreviousPageDisabled && setPageNb(pageNb - 1)}
				>
					<FontAwesomeIcon size="2x" icon={faChevronLeft}></FontAwesomeIcon>
				</div>
				<div className="p-12 w-full">{currentChild}</div>
				<div
					className={classNames(
						'flex items-center',
						isNextPageDisabled ? 'opacity-30' : 'cursor-pointer',
					)}
					onClick={() =>
						!isNextPageDisabled &&
						(isLastPage ? onSubmit() : setPageNb(pageNb + 1))
					}
				>
					<FontAwesomeIcon
						size="2x"
						icon={isLastPage ? submitIcon ?? faPlusCircle : faChevronRight}
					/>
				</div>
			</div>
		);
	};

	return (
		<Modal
			size="lg"
			title={title}
			open={open}
			setOpen={setOpen}
			closeCross
			hideFooter
		>
			{renderPage()}
		</Modal>
	);
};

export default MenuCreation;
