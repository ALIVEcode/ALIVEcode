import { ChildEntity, ManyToOne, JoinColumn } from 'typeorm';
import { ACTIVITY_TYPE, ActivityEntity } from '../activity.entity';
import { RESOURCE_TYPE } from '../../../resource/entities/resource.entity';
import { ResourceVideoEntity } from '../../../resource/entities/resource_video.entity';

/**
 * Activity of type video model in the database
 * @author Enric Solevila
 */
@ChildEntity(ACTIVITY_TYPE.VIDEO)
export class ActivityVideoEntity extends ActivityEntity {
  /** Reference to the resource linked to the activity */
  @ManyToOne(() => ResourceVideoEntity, res => res.activities, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'resourceId' })
  resource: ResourceVideoEntity;

  /** Allowed types of resources inside the activity */
  readonly allowedResources: RESOURCE_TYPE[] = [RESOURCE_TYPE.VIDEO];
}