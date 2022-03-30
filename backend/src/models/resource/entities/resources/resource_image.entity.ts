import { IsNotEmpty, IsOptional } from 'class-validator';
import { ChildEntity, Column } from 'typeorm';
import { RESOURCE_TYPE, ResourceEntity } from '../resource.entity';

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

  /** File extension */
  @Column()
  @IsOptional()
  extension: string;
}
