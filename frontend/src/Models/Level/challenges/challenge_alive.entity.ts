import { Challenge } from '../challenge.entity';
import { BaseLayoutObj } from '../../../Components/LevelComponents/Simulation/Sketch/simulation/ts/typesSimulation';

export enum CHALLENGE_RESOLUTION_MODE {
	ANY = 'ANY',
}

export class ChallengeAlive extends Challenge {
	layout: BaseLayoutObj[];
	initialCode?: string;
	resolution: CHALLENGE_RESOLUTION_MODE;
	solution?: string;
}
