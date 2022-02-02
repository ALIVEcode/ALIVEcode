import { Parent } from 'mdast';

export type albumOptionsType = {
	underline?: boolean;
};

export type underlineOptions = {};

declare module 'mdast' {
	interface StaticPhrasingContentMap {
		underline: Underline;
	}
	interface Underline extends Parent {
		type: 'underline';
		children: PhrasingContent[];
	}
}