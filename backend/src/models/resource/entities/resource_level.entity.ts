import { ChildEntity, Column, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { LevelEntity } from '../../level/entities/level.entity';
import { ResourceEntity, RESOURCE_TYPE } from './resource.entity';
import { ActivityLevelEntity } from '../../course/entities/activities/activity_level.entity';

/**
 * Activity of type Level model in the database
 * @author Enric Solevila
 */
@ChildEntity(RESOURCE_TYPE.LEVEL)
export class ResourceLevelEntity extends ResourceEntity {
  /** Reference to the level to display */
  @ManyToOne(() => LevelEntity, level => level.resources)
  @JoinColumn({ name: 'levelId' })
  level: LevelEntity;

  @Column({ type: 'uuid', name: 'levelId' })
  levelId: string;

  @OneToMany(() => ActivityLevelEntity, act => act.resource)
  activities: ActivityLevelEntity[];
}