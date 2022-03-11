import { createContext } from 'react';
import { Challenge } from '../../Models/Level/challenge.entity';
import { ChallengeProgression } from '../../Models/Level/challengeProgression';
import { typeAskForUserInput } from '../../Pages/Level/challengeTypes';
import { ChallengeExecutor } from '../../Pages/Level/AbstractChallengeExecutor';

export type ChallengeContextTypes = {
	editMode: boolean;
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
