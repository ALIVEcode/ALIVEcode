import React from 'react';
import { CreationMenuProps } from './creationMenuProps';
import { isValidElement, cloneElement } from 'react';

/**
 * Generic Creation Menu for future elements creation
 * @param children The children to render inside the component
 * @param onClick A function to call when clicking any of the children
 * @returns The Creation menu
 *
 * @author Enric Soldevila
 */
const CreationMenu: React.FC<CreationMenuProps> = ({ children, onClick }) => {
	/**
	 * Handles onClick (Not yet used)
	 */
	const handleOnClick = (e: any) => {};

	/**
	 * Add the onClick handle on all the children elements
	 * @returns The children elements with the custom onClick handler
	 */
	const makeChildrenWithProps = () => {
		if (!onClick) return children;
		return (
			children &&
			isValidElement(children) &&
			cloneElement(children as any, { onClick: handleOnClick })
		);
	};

	return (
		<div className="bg-[color:var(--background-color)] gap-8 grid grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3">
			{makeChildrenWithProps()}
		</div>
	);
};

export default CreationMenu;
