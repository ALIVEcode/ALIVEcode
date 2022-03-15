import { IsNotEmpty, IsOptional } from 'class-validator';
import { ChildEntity, Column } from 'typeorm';
import { ResourceEntity, RESOURCE_TYPE } from './resource.entity';

/**
 * Activity of type File model in the database
 * @author Enric Solevila
 */
@ChildEntity(RESOURCE_TYPE.FILE)
export class ResourceFileEntity extends ResourceEntity {
  /** Url of the file */
  @Column()
  @IsNotEmpty()
  url: string;

  /** File extension */
  @Column()
  @IsOptional()
  extension: string;
}