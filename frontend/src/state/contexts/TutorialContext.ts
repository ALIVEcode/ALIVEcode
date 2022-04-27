import { createContext } from 'react';
import { InfoTutorialProps } from '../../Components/HelpComponents/HelpProps';

export interface TutorialContextValues {
	registerTutorial: (tutorial: InfoTutorialProps) => void;
	unregisterTutorial: (name: string) => void;

	startTutorial: (name: string) => void;
	stopTutorial: (name: string) => void;

	getCurrent: () => string | null;

	setCurrentTutorial: (name: string) => void;
	startCurrentTutorial: () => void;
}

export const TutorialContext = createContext<TutorialContextValues>({} as any);
