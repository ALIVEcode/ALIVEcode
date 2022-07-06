export type CmdProps = {
	styledDivId?: string;
};

export type CMD = {
	print: (msg: string) => void;
	error: (msg: string, line: number) => void;
	clear: () => void;
};
