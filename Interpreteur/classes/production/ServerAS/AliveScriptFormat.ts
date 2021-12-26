type aliveScriptRequestFormat = {
	lines: string | string[]
	metadata: {
		version: string
	}
	compilerOptions: {
		allowedModules: string[] | "all"
		declareVariableWithVar: boolean
	}
}
