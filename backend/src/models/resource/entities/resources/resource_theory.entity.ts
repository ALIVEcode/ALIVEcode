import { ChildEntity, Column } from 'typeorm';
import { IsOptional } from 'class-validator';
import { Descendant } from 'slate';
import { ResourceEntity, RESOURCE_TYPE } from '../resource.entity';

/**
 * Activity of type Theory model in the database
 * @author Enric Solevila
 */
@ChildEntity(RESOURCE_TYPE.THEORY)
export class ResourceTheoryEntity extends ResourceEntity {
  /** Content of the theory resource */
  @Column({ type: 'json', default: [{ type: 'paragraph', children: [{ text: '' }] }] })
  @IsOptional()
  document: Descendant[];
}
