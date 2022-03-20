import { Type } from 'class-transformer';
import { Column, ChildEntity, ManyToOne, JoinColumn } from 'typeorm';
import { ACTIVITY_TYPE, ActivityEntity } from '../activity.entity';
import { RESOURCE_TYPE } from '../../../resource/entities/resource.entity';
import { ResourceTheoryEntity } from '../../../resource/entities/resource_theory.entity';

export class ActivityContent {
  body: string;
}

/**
 * Activity of type theory model in the database
 * @author Enric Solevila
 */
@ChildEntity(ACTIVITY_TYPE.THEORY)
export class ActivityTheoryEntity extends ActivityEntity {
  /** Content inside the theory activity (markdown) */
  @Column({ type: 'json', default: {} })
  @Type(() => ActivityContent)
  content: ActivityContent;

  /** Reference to the resource linked to the activity */
  @ManyToOne(() => ResourceTheoryEntity, res => res.activities, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'resourceId' })
  resource: ResourceTheoryEntity;

  /** Allowed types of resources inside the activity */
  readonly allowedResources: RESOURCE_TYPE[] = [RESOURCE_TYPE.THEORY];
}