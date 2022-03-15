/**
 * represent all the valid command names
 */
export type commandNames =
	| 'showSettingsMenu'
	| 'goToNextError'
	| 'goToPreviousError'
	| 'selectall'
	| 'centerselection'
	| 'gotoline'
	| 'fold'
	| 'unfold'
	| 'toggleFoldWidget'
	| 'toggleParentFoldWidget'
	| 'foldall'
	| 'foldAllComments'
	| 'foldOther'
	| 'unfoldall'
	| 'findnext'
	| 'findprevious'
	| 'selectOrFindNext'
	| 'selectOrFindPrevious'
	| 'find'
	| 'overwrite'
	| 'selecttostart'
	| 'gotostart'
	| 'selectup'
	| 'golineup'
	| 'selecttoend'
	| 'gotoend'
	| 'selectdown'
	| 'golinedown'
	| 'selectwordleft'
	| 'gotowordleft'
	| 'selecttolinestart'
	| 'gotolinestart'
	| 'selectleft'
	| 'gotoleft'
	| 'selectwordright'
	| 'gotowordright'
	| 'selecttolineend'
	| 'gotolineend'
	| 'selectright'
	| 'gotoright'
	| 'selectpagedown'
	| 'pagedown'
	| 'gotopagedown'
	| 'selectpageup'
	| 'pageup'
	| 'gotopageup'
	| 'scrollup'
	| 'scrolldown'
	| 'selectlinestart'
	| 'selectlineend'
	| 'togglerecording'
	| 'replaymacro'
	| 'jumptomatching'
	| 'selecttomatching'
	| 'expandToMatching'
	| 'passKeysToBrowser'
	| 'copy'
	| 'cut'
	| 'paste'
	| 'removeline'
	| 'duplicateSelection'
	| 'sortlines'
	| 'togglecomment'
	| 'toggleBlockComment'
	| 'modifyNumberUp'
	| 'modifyNumberDown'
	| 'replace'
	| 'undo'
	| 'redo'
	| 'copylinesup'
	| 'movelinesup'
	| 'copylinesdown'
	| 'movelinesdown'
	| 'del'
	| 'backspace'
	| 'cut_or_delete'
	| 'removetolinestart'
	| 'removetolineend'
	| 'removetolinestarthard'
	| 'removetolineendhard'
	| 'removewordleft'
	| 'removewordright'
	| 'outdent'
	| 'indent'
	| 'blockoutdent'
	| 'blockindent'
	| 'insertstring'
	| 'inserttext'
	| 'splitline'
	| 'transposeletters'
	| 'touppercase'
	| 'tolowercase'
	| 'autoindent'
	| 'expandtoline'
	| 'joinlines'
	| 'invertSelection'
	| 'addLineAfter'
	| 'addLineBefore'
	| 'openCommandPallete'
	| 'modeSelect'
	| 'foldToLevel1'
	| 'foldToLevel2'
	| 'foldToLevel3'
	| 'foldToLevel4'
	| 'foldToLevel5'
	| 'foldToLevel6'
	| 'foldToLevel7'
	| 'foldToLevel8'
	| 'addCursorAbove'
	| 'addCursorBelow'
	| 'addCursorAboveSkipCurrent'
	| 'addCursorBelowSkipCurrent'
	| 'selectMoreBefore'
	| 'selectMoreAfter'
	| 'selectNextBefore'
	| 'selectNextAfter'
	| 'toggleSplitSelectionIntoLines'
	| 'splitSelectionIntoLines'
	| 'alignCursors'
	| 'findAll'
	| 'startAutocomplete'
	| 'expandSnippet';

/**
 * represent the possible arguments that a command can take
 */
export type command_args =
	| number /* line */
	| string /* str */
	| { times: number; text?: string }; /* args */

/**
 * represent a valid command
 */
export type command = {
	command: commandNames;
	args: command_args;
};

export type SymbolPair = {
	open: string;
	close: string;
};

export type contexts =
	| 'comment'
	| 'docComment'
	| 'expression'
	| 'program'
	| 'string';

export type snippetsType = { name: string; code: string };

/**
 * represent the position of the cursor
 */
export type Position = { row: number; column: number };
