/**
 * ALBUM
 * (AL)ive (B)eautiful (U)timate (M)arkdown
 */

import { albumOptionsType, underlineOptions } from './albumTypes';
import { visit, Parent } from 'unist-util-visit';
import { is } from 'unist-util-is';
import { Root, Text } from 'mdast';


export namespace remarkAlbum {

	export const asCodeBlock = () => {
		return (tree: Root) => {
			visit(tree, 'code', node => {
				//node.lang = `hljs-${node.lang}`
			});
		};
	};

	
}


/* 
bonjour, j'aimerais --souligner-- ce --mot-- et --celui-ci--.
T<bonjour, j'aimerais > U<souligner> T< ce > U<mot> T< et > U<celui-ci> T<.>

*/