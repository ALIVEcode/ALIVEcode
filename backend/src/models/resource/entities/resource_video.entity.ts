import { ChildEntity, Column } from 'typeorm';
import { ResourceEntity, RESOURCE_TYPE } from './resource.entity';

/**
 * Activity of type Video model in the database
 * @author Enric Solevila
 */
@ChildEntity(RESOURCE_TYPE.VIDEO)
export class ResourceVideoEntity extends ResourceEntity {
  /** Url of the video */
  @Column()
  url: string;
}