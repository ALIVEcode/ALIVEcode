import { ResourceWithOptions } from 'adminjs';
import { challengeParent } from './challenge.parent';
import { ChallengeCodeEntity } from '../../../models/challenge/entities/challenges/challenge_code.entity';

const ChallengeCodeResource: ResourceWithOptions = {
  resource: ChallengeCodeEntity,
  options: { parent: challengeParent },
};

export default ChallengeCodeResource;