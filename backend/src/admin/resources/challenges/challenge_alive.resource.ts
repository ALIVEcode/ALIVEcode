import { ResourceWithOptions } from 'adminjs';
import { challengeParent } from './challenge.parent';
import { ChallengeAliveEntity } from '../../../models/challenge/entities/challenges/challenge_alive.entity';

const ChallengeAliveResource: ResourceWithOptions = {
  resource: ChallengeAliveEntity,
  options: { parent: challengeParent },
};

export default ChallengeAliveResource;