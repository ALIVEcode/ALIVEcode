import { createContext } from 'react';
import { InfoTutorialProps } from '../../Components/HelpComponents/HelpProps';

/**
 * @author Mathis Laroche
 */
export interface TutorialContextValues {
	/**
	 * @description Register a new tutorial
	 * @param infoTutorialProps The info of the new tutorial
	 * @returns a function to remove the tutorial
	 */
	registerTutorial: (tutorial: InfoTutorialProps) => () => void;
	/**
	 * @description Remove a tutorial
	 * @param name The name of the tutorial to remove
	 */
	unregisterTutorial: (name: string) => void;

	/**
	 * @description Start the tutorial with the given name
	 * @param name The name of the tutorial to start
	 * @returns a function to stop the tutorial
	 */
	startTutorial: (name: string) => () => void;
	/**
	 * @description Stop the tutorial with the given name if it is running
	 * @param name The name of the tutorial to stop
	 */
	stopTutorial: (name: string) => void;

	/**
	 * @description Get the tutorial with the given name or null if it does not exist
	 * @param name The name of the tutorial to get
	 * @returns the name of the tutorial or null if it does not exist
	 */
	getCurrent: () => string | null;

	/**
	 * @description Set the tutorial with the given name as the current tutorial
	 * @param name The name of the tutorial to set as current
	 */
	setCurrentTutorial: (name: string) => void;

	/**
	 * @description Start the current tutorial
	 * @returns a function to stop the tutorial
	 */
	startCurrentTutorial: () => () => void;

	/**
	 * @description Stop the current tutorial if it is running
	 */
	stopCurrentTutorial: () => void;
}

export const TutorialContext = createContext<TutorialContextValues>({} as any);
