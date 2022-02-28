import React from 'react';
import { CreationMenuProps } from './creationMenuProps';
import { isValidElement, cloneElement } from 'react';

const CreationMenu: React.FC<CreationMenuProps> = ({ children, onClick }) => {
	const handleOnClick = (e: any) => {
		console.log(e);
	};

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
