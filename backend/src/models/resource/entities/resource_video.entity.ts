import { IsNotEmpty } from 'class-validator';
import { ChildEntity, Column, OneToMany } from 'typeorm';
import { ActivityVideoEntity } from '../../course/entities/activities/activity_video.entity';
import { ResourceEntity, RESOURCE_TYPE } from './resource.entity';

/**
 * Activity of type Video model in the database
 * @author Enric Solevila
 */
@ChildEntity(RESOURCE_TYPE.VIDEO)
export class ResourceVideoEntity extends ResourceEntity {
  /** Url of the video */
  @Column()
  @IsNotEmpty()
  url: string;

  /** Activities containing this resource */
  @OneToMany(() => ActivityVideoEntity, act => act.resource)
  activities: ActivityVideoEntity[];
}