import { ChildEntity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { ACTIVITY_TYPE, ActivityEntity } from '../activity.entity';
import { ResourceLevelEntity } from '../../../resource/entities/resource_level.entity';

/**
 * Activity of type Level model in the database
 * @author Enric Solevila
 */
@ChildEntity(ACTIVITY_TYPE.LEVEL)
export class ActivityLevelEntity extends ActivityEntity {
  /** Reference to the level to display */
  @ManyToOne(() => ResourceLevelEntity, res => res.activities, { eager: true })
  @JoinColumn({ name: 'resourceId' })
  resource: ResourceLevelEntity;

  @Column({ type: 'uuid', nullable: true })
  resourceId: string;
}