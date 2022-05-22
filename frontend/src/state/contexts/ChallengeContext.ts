import { createContext } from 'react';
import { Challenge } from '../../Models/Challenge/challenge.entity';
import { ChallengeProgression } from '../../Models/Challenge/challengeProgression';
import { typeAskForUserInput } from '../../Pages/Challenge/challengeTypes';
import { ChallengeExecutor } from '../../Pages/Challenge/AbstractChallengeExecutor';

export type ChallengeContextTypes = {
	editMode: boolean;
	showTerminal?: boolean;
	challenge?: Challenge;
	executor: React.MutableRefObject<ChallengeExecutor | null>;
	saveChallenge: () => void;
	saveChallengeTimed: () => void;
	progression?: ChallengeProgression;
	setProgression: (progression: ChallengeProgression) => void;
	saveProgression: () => void;
	saveProgressionTimed: () => void;
	saving: boolean;
	saved: boolean;
	setShowConfetti: (bool: boolean) => void;
	askForUserInput: typeAskForUserInput;
	setOpenSettings: (bool: boolean) => void;
};

export const ChallengeContext = createContext<ChallengeContextTypes>({
	executor: { current: null },
	editMode: false,
	saveChallenge: () => {},
	saveChallengeTimed: () => {},
	setProgression: () => {},
	saveProgression: () => {},
	saveProgressionTimed: () => {},
	saved: false,
	saving: false,
	setShowConfetti: () => {},
	askForUserInput: () => {},
	setOpenSettings: () => {},
});
