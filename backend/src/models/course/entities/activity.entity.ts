import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, TableInheritance, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { IsEmpty, IsOptional } from 'class-validator';
import { CourseElementEntity } from './course_element.entity';
import { Descendant } from 'slate';
import { ResourceEntity, RESOURCE_TYPE } from '../../resource/entities/resource.entity';

/** Enum for all the types of activities */
export enum ACTIVITY_TYPE {
  THEORY = 'TH',
  CHALLENGE = 'CH',
  VIDEO = 'VI',
  PDF = 'PF',
  ASSIGNMENT = 'AS',
}

/**
 * Generic activity model in the database
 * @author Enric Soldevila, Mathis Laroche
 */
@Entity()
@TableInheritance({ column: 'type' })
export abstract class ActivityEntity {
  /** Id of the activity (0, 1, 2, ..., n) */
  @PrimaryGeneratedColumn('increment')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: number;

  /** Type of the activity */
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  @Column({ type: 'enum', name: 'type', enum: ACTIVITY_TYPE, default: ACTIVITY_TYPE.THEORY })
  readonly type: ACTIVITY_TYPE;

  /** Header of the activity */
  @IsOptional()
  @Column({ nullable: true, default: null, type: 'json' })
  header: Descendant[];

  /** Footer of the activity */
  @IsOptional()
  @Column({ nullable: true, default: null, type: 'json' })
  footer: Descendant[];

  /** CourseElement attached to the activity */
  @OneToOne(() => CourseElementEntity, el => el.activity, { onDelete: 'CASCADE' })
  @JoinColumn()
  courseElement: CourseElementEntity;

  /** Id of the referenced resource */
  @Column({ type: 'uuid', nullable: true })
  resourceId: string;

  abstract readonly allowedResources: RESOURCE_TYPE[];

  /** Reference to the resource linked to the activity */
  @ManyToOne(() => ResourceEntity, res => res.activities, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'resourceId' })
  resource: ResourceEntity;
}
