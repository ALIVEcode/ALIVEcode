import { ChildEntity, Column, OneToMany } from 'typeorm';
import { ResourceEntity, RESOURCE_TYPE } from './resource.entity';
import { IsOptional } from 'class-validator';
import { ActivityTheoryEntity } from '../../course/entities/activities/activity_theory.entity';

/**
 * Activity of type Theory model in the database
 * @author Enric Solevila
 */
@ChildEntity(RESOURCE_TYPE.THEORY)
export class ResourceTheoryEntity extends ResourceEntity {
  /** Content of the theory resource */
  @Column({ type: 'json', nullable: true })
  @IsOptional()
  document: object;
}