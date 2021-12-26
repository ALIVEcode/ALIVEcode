import { Root, Text, Element, Comment } from 'hast'
import { visit } from "unist-util-visit";

declare type Raw = any;

export namespace rehypeAlbum {
	export const underline = () => {
		return (tree: Root) => {
			const underlineRegex = /--.*?--/gm;

			visit(tree, 'element', node => {
				const newChildren: (Text | Element | Comment | Raw)[] = [];
				if (node.properties?.className === 'underlineNode') return;

				node.children.forEach(child => {
					if (child.type !== 'text') {
						newChildren.push(child);
						return;
					}

					const matches = child.value.match(underlineRegex);
					if (!matches) {
						newChildren.push(child);
						return;
					}

					child.value.split(underlineRegex).forEach((text, index) => {
						newChildren.push({
							type: 'text',
							value: text,
						});
						if (!matches || matches?.length <= index) return;
						newChildren.push({
							type: 'element',
							tagName: 'span',
							children: [
								{
									type: 'text',
									value: matches[index].substring(2, matches[index].length - 2),
								},
							],
							properties: {
								className: 'underlineNode',
								style: 'text-decoration: underline;',
							},
						});
					});
				});

				node.children = newChildren;
			});
		};
	};
	export const asCodeBlock = () => {
		return (tree: Root) => {
			visit(tree, 'element', node => {
				//if (
				//	node.tagName !== 'code' ||
				//	(node.properties?.className as string[])[0] !== 'languge-alivescript'
				//) {
				//	return;
				//}
			});
		};
	};

	export const print = () => {
		return (tree: Root) => {
			visit(tree, node => {
				console.log(node);
			});
		};
	};
} 
