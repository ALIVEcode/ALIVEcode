import { useState, useEffect } from 'react';
import { CMD } from '../../Components/LevelComponents/Cmd/cmdTypes';
import { ClassConstructor } from 'class-transformer';
import LevelCodeExecutor from '../../Pages/Level/LevelCode/LevelCodeExecutor';

const useExecutor = <T extends LevelCodeExecutor>(
	U: ClassConstructor<T>,
	cmd: CMD | null,
) => {
	const [executor, setExecutor] = useState<T>();
	const [lines, setLines] = useState<string>('');
	const [sketch, setSketch] = useState<any>();

	useEffect(() => {
		if (executor) {
			executor.lineInterfaceContent = lines;
			if (sketch) (executor as any).s = sketch;
		}
	}, [executor, lines, sketch]);

	if (executor && cmd) executor.cmd = cmd;

	const toggleExecution = (exec: T) => {
		if (!exec) return;
		exec.execution = !exec.execution;
		const updatedExecutor = Object.assign(new U(), { ...exec });
		setExecutor(updatedExecutor);
	};

	if (executor && !executor.onToggleExecution)
		executor.onToggleExecution = toggleExecution;

	const setExecutorLines = (lines: string) => {
		setLines(lines);
	};

	return {
		executor,
		setExecutor,
		setSketch,
		setExecutorLines,
	};
};

export default useExecutor;