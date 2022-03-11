import { ResourceWithOptions } from 'adminjs';
import { ChallengeEntity } from '../../../models/challenge/entities/challenge.entity';
import { challengeParent } from './challenge.parent';

const ChallengeResource: ResourceWithOptions = {
  resource: ChallengeEntity,
  options: { parent: challengeParent },
};

export default ChallengeResource;