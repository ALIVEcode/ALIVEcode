import { ChildEntity} from 'typeorm';
import { ACTIVITY_TYPE, ActivityEntity } from '../activity.entity';
import { RESOURCE_TYPE } from '../../../resource/entities/resource.entity';

/**
 * Activity of type challenge model in the database
 * @author Enric Solevila
 */
@ChildEntity(ACTIVITY_TYPE.CHALLENGE)
export class ActivityChallengeEntity extends ActivityEntity {
  /** Allowed types of resources inside the activity */
  readonly allowedResources: [RESOURCE_TYPE, ...Array<string>] = [RESOURCE_TYPE.CHALLENGE];
}