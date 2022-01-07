import { useLocation } from 'react-router';
import { useMemo } from 'react';

export const useQuery = () => {
	const { search } = useLocation();

	return useMemo(() => new URLSearchParams(search), [search]);
};