import { ChildEntity, JoinColumn, ManyToOne } from 'typeorm';
import { ACTIVITY_TYPE, ActivityEntity } from '../activity.entity';
import { ResourceChallengeEntity } from '../../../resource/entities/resource_challenge.entity';
import { RESOURCE_TYPE } from '../../../resource/entities/resource.entity';

/**
 * Activity of type challenge model in the database
 * @author Enric Solevila
 */
@ChildEntity(ACTIVITY_TYPE.CHALLENGE)
export class ActivityChallengeEntity extends ActivityEntity {
  /** Reference to the resource linked to the activity */
  @ManyToOne(() => ResourceChallengeEntity, res => res.activities, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'resourceId' })
  resource: ResourceChallengeEntity;

  /** Allowed types of resources inside the activity */
  readonly allowedResources: RESOURCE_TYPE[] = [RESOURCE_TYPE.CHALLENGE];
}