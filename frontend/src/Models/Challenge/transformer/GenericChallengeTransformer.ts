import { Type } from 'class-transformer';
import {
	Challenge,
	CHALLENGE_TYPE,
	DifferentChallenges,
} from '../challenge.entity';
import { ChallengeAI } from '../challenges/challenge_ai.entity';
import { ChallengeCode } from '../challenges/challenge_code.entity';
import { ChallengeAlive } from '../challenges/challenge_alive.entity';
import { ChallengeIoT } from '../challenges/challenge_IoT.entity';

/**
 * DTO transformer for transforming to instance a generic Resource object
 */
export class GenericChallengeTransformer {
	@Type(obj => {
		console.log(obj?.object.challenge);
		switch (obj?.object.challenge.type) {
			case CHALLENGE_TYPE.AI:
				return ChallengeAI;
			case CHALLENGE_TYPE.CODE:
				return ChallengeCode;
			case CHALLENGE_TYPE.ALIVE:
				return ChallengeAlive;
			case CHALLENGE_TYPE.IOT:
				return ChallengeIoT;
		}
		return Challenge;
	})
	challenge: DifferentChallenges;
}
