import { IsNotEmpty } from 'class-validator';
import { ChildEntity, Column, OneToMany } from 'typeorm';
import { ResourceEntity, RESOURCE_TYPE } from './resource.entity';

/**
 * Activity of type Image model in the database
 * @author Enric Solevila
 */
@ChildEntity(RESOURCE_TYPE.IMAGE)
export class ResourceImageEntity extends ResourceEntity {
  /** Url of the image */
  @Column()
  @IsNotEmpty()
  url: string;

  @Column()
  extension: string;
}
