import { ChildEntity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { ACTIVITY_TYPE, ActivityEntity } from '../activity.entity';
import { ResourceChallengeEntity } from '../../../resource/entities/resource_challenge.entity';

/**
 * Activity of type challenge model in the database
 * @author Enric Solevila
 */
@ChildEntity(ACTIVITY_TYPE.CHALLENGE)
export class ActivityChallengeEntity extends ActivityEntity {
  /** Reference to the level to display */
  @ManyToOne(() => ResourceChallengeEntity, res => res.activities, { eager: true })
  @JoinColumn({ name: 'resourceId' })
  resource: ResourceChallengeEntity;

  /** Id of the referenced resource */
  @Column({ type: 'uuid', nullable: true })
  resourceId: string;
}