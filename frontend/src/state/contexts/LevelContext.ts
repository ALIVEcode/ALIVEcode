import { createContext } from "react";
import { Level } from '../../Models/Level/level.entity';
import { LevelProgression } from '../../Models/Level/levelProgression';
import { typeAskForUserInput } from '../../Pages/Level/levelTypes';
import { LevelExecutor } from '../../Pages/Level/AbstractLevelExecutor';

export type LevelContextTypes = {
	editMode: boolean;
	level?: Level;
	executor: React.MutableRefObject<LevelExecutor | null>;
	saveLevel: () => void;
	saveLevelTimed: () => void;
	progression?: LevelProgression;
	setProgression: (progression: LevelProgression) => void;
	saveProgression: () => void;
	saveProgressionTimed: () => void;
	saving: boolean;
	saved: boolean;
	setShowConfetti: (bool: boolean) => void;
	askForUserInput: typeAskForUserInput;
	setOpenSettings: (bool: boolean) => void;
};

export const LevelContext = createContext<LevelContextTypes>({
	executor: { current: null },
	editMode: false,
	saveLevel: () => {},
	saveLevelTimed: () => {},
	setProgression: () => {},
	saveProgression: () => {},
	saveProgressionTimed: () => {},
	saved: false,
	saving: false,
	setShowConfetti: () => {},
	askForUserInput: () => {},
	setOpenSettings: () => {},
});