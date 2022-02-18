import { useState, useEffect, useRef } from 'react';

type WaitBeforeUpdateProps = {
	onUpdate: () => void;
	wait: number;
};

const useWaitBeforeUpdate = <T>(
	{ wait, onUpdate }: WaitBeforeUpdateProps,
	initialValue: T | (() => T),
): [T, React.Dispatch<React.SetStateAction<T>>] => {
	const [state, setState] = useState<T>(initialValue);
	const timeout = useRef<NodeJS.Timeout | null>();
	const firstRender = useRef<boolean>(true);

	useEffect(() => {
		if (firstRender.current) {
			firstRender.current = false;
			return;
		}
		timeout.current && clearTimeout(timeout.current);
		timeout.current = setTimeout(onUpdate, wait);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state, wait]);

	useEffect(() => {
		return () => {
			timeout.current && clearTimeout(timeout.current);
		};
	}, []);

	return [state, setState];
};

export default useWaitBeforeUpdate;
