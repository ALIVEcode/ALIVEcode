import { Challenge } from '../../../Models/Challenge/challenge.entity';
import { ChallengeAlive } from '../../../Models/Challenge/challenges/challenge_alive.entity';
import { ChallengeCode } from '../../../Models/Challenge/challenges/challenge_code.entity';

export type ChallengeCardProps = {
	challenge: ChallengeAlive | ChallengeCode | Challenge;
	enterEdit?: boolean;
};
