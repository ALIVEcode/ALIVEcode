import { command, Position, snippetsType } from "./autocompleteTypes";
import ace from 'ace-builds'

export let editor: any;
export function setEditor(e: any) {
	editor = e;
}

export const registerSnippets = (
	editor: ace.Ace.Editor,
	mode: string,
	snippetText: string,
) => {
	var snippetManager = ace.require('ace/snippets').snippetManager;
	console.log(snippetManager);

	const scope = mode;
	const snippet = snippetManager.parseSnippetFile(snippetText, scope);

	snippetManager.register(snippet, scope);
};

export const createSnippets = (snippets: snippetsType[] | snippetsType) =>
	(Array.isArray(snippets) ? snippets : [snippets])
		.map(({ name, code }) =>
			[
				'snippet ' + name,
				code
					.split('\n')
					.map(c => '\t' + c)
					.join('\n'),
			].join('\n'),
		)
		.join('\n');

export function execCommands(...commands: command[]) {
	for (const command of commands) {
		editor.commands.exec(command.command, editor, command.args);
	}
}

/**
 * @returns the current position of the cursor as an object of form
 * `{ row: number, column: number }`
 */
export function getPos(): Position {
	return editor.getCursorPosition();
}

/**
 * get the line at the specified row
 * @param row the index of the line
 * @returns the line at the specified row or `undefined` if there is none
 */
export function getLine(row: number): string {
	return editor.session.getLine(row);
}

/**
 * get the lines from one row to another row
 * @param start the first row included in the array
 * @param end the last row included in the array (default is the last row of the document)
 * @returns the array of lines between the start row and the end row
 */
export function getLines(start: number, end: number | null = null): string[] {
	return editor.session.getLines(start, end || editor.session.getLength());
}

/**
 * check if the line startswith a specify string and ignores the indentation at the start of the line
 * @param line the line to be tested
 * @param start the string
 * @returns if the line starts with start
 */
export function lineStartWith(line: string, start: string): boolean {
	return line.trimLeft().startsWith(start);
}