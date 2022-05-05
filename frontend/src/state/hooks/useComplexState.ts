import { useCallback, useState } from 'react';

function useComplexState<T>(
	defaultValue: T | (() => T),
): [T, (newState: T) => void, () => void];

// convenience overload when passing no default params
function useComplexState<T = undefined>(
	defaultValue?: T | (() => T),
): [T | undefined, (newState: T | undefined) => void, () => void];

/**
 * An implementation of {@link useState} that automatically deals with object's and array's update
 * @param defaultValue same as useState
 *
 * @author Mathis Laroche
 */
function useComplexState<T>(
	defaultValue: T,
): [T, (newState: T) => void, () => void] {
	const [state, _setState] = useState<T>(defaultValue);

	const setState = useCallback(
		(newState: T) => {
			if (Array.isArray(newState)) {
				_setState([...newState] as unknown as T);
			} else if (typeof state === 'object') _setState({ ...newState });
			else _setState(newState);
		},
		[state],
	);

	const updateState = useCallback(() => {
		setState(state);
	}, [setState, state]);

	return [state, setState, updateState];
}

export default useComplexState;
