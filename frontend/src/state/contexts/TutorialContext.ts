import { createContext } from 'react';

interface TutorialContextValues {
	registerTutorial: (name: string) => boolean;
	unregisterTutorial: (name: string) => boolean;

	startTutorial: (name: string) => boolean;
	stopTutorial: (name: string, cascade?: boolean) => boolean;

	getCurrent: () => string | null;

	pushTutorial: (name: string) => void;
	popTutorial: () => string;

	setCurrentTutorial: (trigger: () => void) => void;
	startCurrentTutorial: () => void;
}

export const getTutorialContextValues = (): TutorialContextValues => {
	const tutorials = [];
	let currentTrigger: () => void;

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

	function setCurrentTutorial(trigger: () => void) {
		currentTrigger = trigger;
	}

	function startCurrentTutorial() {
		currentTrigger && currentTrigger();
	}

	return {
		getCurrent,
		registerTutorial,
		popTutorial,
		pushTutorial,
		startTutorial,
		stopTutorial,
		unregisterTutorial,
		setCurrentTutorial,
		startCurrentTutorial,
	};
};

export const TutorialContext = createContext<TutorialContextValues>(
	getTutorialContextValues(),
);
