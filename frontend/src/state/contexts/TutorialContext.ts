import { createContext } from 'react';

interface TutorialContextValues {
	registerTutorial: (name: string) => boolean;
	unregisterTutorial: (name: string) => boolean;

	startTutorial: (name: string) => boolean;
	stopTutorial: (name: string, cascade?: boolean) => boolean;

	getCurrent: () => string | null;

	pushTutorial: (name: string) => void;
	popTutorial: () => string;
}

const getTutorialContextValues = (): TutorialContextValues => {

	const tutorials = [];

	function getCurrent(): string | null {
		return null;
	}

	function popTutorial(): string {
		return '';
	}

	function pushTutorial(name: string): void {}

	function registerTutorial(name: string): boolean {
		return false;
	}

	function startTutorial(name: string): boolean {
		return false;
	}

	function stopTutorial(name: string, cascade: boolean | undefined): boolean {
		return false;
	}

	function unregisterTutorial(name: string): boolean {
		return false;
	}

	return {
		getCurrent,
		registerTutorial,
		popTutorial,
		pushTutorial,
		startTutorial,
		stopTutorial,
		unregisterTutorial,
	};
};

export const TutorialContext = createContext<TutorialContextValues>(
	getTutorialContextValues(),
);
