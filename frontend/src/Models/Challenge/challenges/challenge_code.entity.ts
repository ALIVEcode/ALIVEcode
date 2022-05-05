import { Challenge } from '../challenge.entity';

export enum CHALLENGE_RESOLUTION_MODE {
	ANY = 'ANY',
}

export class ChallengeCode extends Challenge {
	resolution: CHALLENGE_RESOLUTION_MODE;
	initialCode?: string;
	testCases: string;
	solution?: string;
}
