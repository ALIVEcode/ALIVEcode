import { Challenge } from '../../../Models/Level/challenge.entity';
import { ChallengeAlive } from '../../../Models/Level/challenges/challenge_alive.entity';
import { ChallengeCode } from '../../../Models/Level/challenges/challenge_code.entity';

export type ChallengeCardProps = {
	challenge: ChallengeAlive | ChallengeCode | Challenge;
	enterEdit?: boolean;
};
