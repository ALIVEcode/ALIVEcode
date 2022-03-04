import { useCallback, useState, useLayoutEffect } from 'react';

export type ScreenType = 'phone' | 'tablet' | 'laptop' | 'desktop';

const useView = () => {
	const [viewHeight, setViewHeight] = useState<number>();
	const [viewWidth, setViewWidth] = useState<number>();

	const updateViewHeight = useCallback(() => {
		const height =
			Math.max(document.documentElement.clientHeight, window.innerHeight || 0) -
			64;
		const width = Math.max(
			document.documentElement.clientWidth,
			window.innerWidth || 0,
		);
		setViewHeight(height);
		setViewWidth(width);
	}, []);

	useLayoutEffect(() => {
		updateViewHeight();
		window.addEventListener('resize', updateViewHeight);

		return () => {
			window.removeEventListener('resize', updateViewHeight);
		};
	}, [updateViewHeight]);

	const getScreenType = (): ScreenType | null => {
		if (viewWidth == null) return null;
		if (viewWidth >= 1280) return 'desktop';
		if (viewWidth >= 1024) return 'laptop';
		if (viewWidth >= 640) return 'tablet';

		return 'phone';
	};

	console.log(getScreenType());

	return {
		width: viewWidth,
		height: viewHeight,
		screenType: getScreenType(),
	};
};

export default useView;
