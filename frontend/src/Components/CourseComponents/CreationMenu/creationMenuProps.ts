import React, {
	Children,
	cloneElement,
	isValidElement,
	ReactChild,
	ReactNode,
} from 'react';
import { isFragment } from 'react-is';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type CreationMenuProps = {
	open: boolean;
	setOpen: (state: boolean) => void;
	title: string;
	children: React.ReactNode;
	onSubmit: () => void;
	defaultPageNb?: number;
	submitIcon?: IconDefinition;
	disabledPageIndex?: number;
};

/**
 * Function to flatten react children to ignore react fragments.
 * Picked from: https://www.smashingmagazine.com/2021/08/react-children-iteration-methods/
 * @param children children to flatten
 * @param depth Current depth
 * @param keys Current used keys to distinguish between list elements
 * @returns
 */
export function flattenChildren(
	// only needed argument
	children: ReactNode,
	// only used for debugging
	depth: number = 0,
	// is not required, start with default = []
	keys: (string | number)[] = [],
): ReactChild[] {
	/*************** 2. ***************/
	return Children.toArray(children).reduce(
		(acc: ReactChild[], node, nodeIndex) => {
			if (isFragment(node)) {
				/*************** 5. ***************/
				acc.push.apply(
					acc,
					flattenChildren(
						node.props.children,
						depth + 1,
						/*************** 6. ***************/
						keys.concat(node.key || nodeIndex),
					),
				);
			} else {
				/*************** 4. ***************/
				if (isValidElement(node)) {
					acc.push(
						cloneElement(node, {
							/*************** 6. ***************/
							key: keys.concat(String(node.key)).join('.'),
						}),
					);
				} else if (
					/*************** 3. ***************/
					typeof node === 'string' ||
					typeof node === 'number'
				) {
					acc.push(node);
				}
			}
			return acc;
		},
		/*************** Acculumator Array ***************/
		[],
	);
}
