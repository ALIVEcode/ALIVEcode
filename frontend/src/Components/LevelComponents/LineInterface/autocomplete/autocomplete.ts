//#region Types

import { command, SymbolPair } from "./autocompleteTypes";
import {
	createSnippets,
	registerSnippets,
	setEditor,
} from './autocompleteUtils';

import {
	getPos,
	getLine,
	execCommands,
	lineStartWith,
	getLines,
	editor,
} from './autocompleteUtils';

import snippets from './as_snippets.json';
import ace from 'ace-builds';

//#endregion types

const patterns: {
	symbolPairs: SymbolPair[];
	blocks: SymbolPair[];
} = {
	/**
	 *? blocks: {
	 **   name: [start, end]
	 *? }
	 */
	symbolPairs: [
		{ open: '"', close: '"' },
		{ open: "'", close: "'" },
		{ open: '(', close: ')' },
		{ open: '{', close: '}' },
		{ open: '[', close: ']' },
	],

	blocks: [
		// si
		{ open: 'si', close: 'fin si' },

		// fonctions
		{ open: 'fonction', close: 'fin fonction' },

		//getter
		{ open: 'get', close: 'fin get' },

		//setter
		{ open: 'set', close: 'fin set' },

		// structures
		{ open: 'structure', close: 'fin structure' },

		// boucles
		{ open: 'faire', close: 'tant que' },
		{ open: 'tant que', close: 'fin tant que' },
		{ open: 'pour', close: 'fin pour' },
		{ open: 'repeter', close: 'fin repeter' },
	],
};

function closeSymbolPair(
	symbol: SymbolPair,
	keyString: string,
	goBackTimes: number = 1,
): command | undefined {
	const pos = getPos();
	const line = getLine(pos.row);
	if (line[pos.column] === symbol.close) {
		return { command: 'gotoright', args: { times: 1 } };
	}
	// doesn't add the pair if the symbole is placed before a word or an opening symbol
	else if (
		// does nothing if the symbol is added before a letter or an opening symbol
		line[pos.column]?.match(/\p{L}+/u) ||
		line[pos.column]?.match(
			`|${patterns.symbolPairs.map(pair => '\\' + pair.open).join('|')}`,
		) ||
		// does nothing if the symbole typed is the closing symbol and the closing symbol is not the same as the opening symbol
		(keyString === symbol.close && symbol.close !== symbol.open) ||
		// return before adding the pair if the symbol is the closing symbol
		(symbol.close === symbol.open && line[pos.column - 1] === symbol.open)
	) {
		return;
	}

	execCommands({
		command: 'insertstring',
		args: `${symbol.open}${symbol.close}`,
	});
	return { command: 'gotoleft', args: { times: goBackTimes } };
}

function closeBlock(): command | undefined {
	const pos = getPos();
	const currentLine = getLine(pos.row);
	if (!currentLine) return;

	const blockPairs = Object.values(patterns.blocks);

	const blockPair = blockPairs.find(blockPair =>
		lineStartWith(currentLine, blockPair.open),
	);
	if (!blockPair) return;

	const tabSize = editor.session.$tabSize;

	const spaces = currentLine
		.substring(0, currentLine.indexOf(currentLine.trimLeft()[0]))
		.replace('\t', ' '.repeat(tabSize)).length;

	//* check if the block has already been closed
	for (const line of getLines(pos.row + 1) || []) {
		// the line checked must have the same indentation to be a potential closing statement
		if (line.length - line.trimLeft().length === spaces) {
			// if a new block of the same type is open before the current block is close, the current block must be closed
			if (lineStartWith(line, blockPair.open)) {
				break;
			}
			// if a closing statement of the good type is found, there is no need to add another one
			else if (lineStartWith(line, blockPair.close)) {
				return {
					command: 'insertstring',
					args: '\n' + ' '.repeat(spaces + tabSize),
				};
			}
		}
	}

	execCommands(
		{
			command: 'insertstring',
			args: `\n\n${' '.repeat(spaces)}${blockPair.close}`,
		},
		{ command: 'golineup', args: { times: 1 } },
	);
	return { command: 'insertstring', args: ' '.repeat(spaces + tabSize) };
}

export class Autocomplete {
	handleKeyboard(
		data: any,
		hashId: number,
		keyString: string,
		keyCode: number,
		e: unknown,
	) {
		const pos = getPos();
		const line = getLine(pos.row);
		if (hashId === -1) {
			const symbolPair: SymbolPair | undefined = Object.values(
				patterns.symbolPairs,
			).find(symbol => symbol.open === keyString || symbol.close === keyString);

			if (symbolPair !== undefined) {
				return closeSymbolPair(symbolPair, keyString);
			}

			// if the \n is pressed at the end of the line
			if (
				keyString === '\n' &&
				line.trim() &&
				pos.column >= line.trimRight().length
			) {
				return closeBlock();
			}
		}
	}
}

function addSnippets(editor: ace.Ace.Editor) {
	registerSnippets(editor, 'alivescript', createSnippets(snippets));
}

const setAutocomplete = (e: ace.Ace.Editor) => {
	setEditor(e);
	addSnippets(e);
};

export { setAutocomplete, addSnippets };