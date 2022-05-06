import {
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  TableInheritance,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { IsNotEmpty, IsEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { SUBJECTS } from '../../../generics/types/sharedTypes';
import { ProfessorEntity } from '../../user/entities/user.entity';
import { OneToMany } from 'typeorm';
import { ResourceChallengeEntity } from './resources/resource_challenge.entity';
import { ActivityEntity } from '../../course/entities/activity.entity';
import { ResourceFileEntity } from './resources/resource_file.entity';
import { ResourcePdfEntity } from './resources/resource_pdf.entity';
import { ResourceTheoryEntity } from './resources/resource_theory.entity';
import { ResourceVideoEntity } from './resources/resource_video.entity';
import { FileEntity } from 'src/models/file/entities/file.entity';

/** Enum of all the type of resources */
export enum RESOURCE_TYPE {
  VIDEO = 'VI',
  FILE = 'FI',
  PDF = 'PF',
  CHALLENGE = 'CH',
  THEORY = 'TH',
}

/** Typing for all different type of resources */
export type DifferentResources =
  | ResourceChallengeEntity
  | ResourceFileEntity
  | ResourcePdfEntity
  | ResourceTheoryEntity
  | ResourceVideoEntity;

/**
 * Generic resource model in the database
 * @author Enric Soldevila
 */
@Entity()
@TableInheritance({ column: 'type' })
export class ResourceEntity {
  /** Id of the resource */
  @PrimaryGeneratedColumn('uuid')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: string;

  /** Name of the resource */
  @Column({ nullable: false })
  @IsNotEmpty()
  name: string;

  /** Type of the resource */
  @Column({ type: 'enum', name: 'type', enum: RESOURCE_TYPE, default: RESOURCE_TYPE.FILE })
  @IsEmpty()
  type: RESOURCE_TYPE;

  /** Subject of the resource */
  @Column({ type: 'enum', enum: SUBJECTS, default: SUBJECTS.OTHER })
  @IsNotEmpty()
  subject: SUBJECTS;

  /** Creation date of the resource */
  @CreateDateColumn()
  @IsEmpty()
  creationDate: Date;

  /** Update date of the resource */
  @UpdateDateColumn()
  @IsEmpty()
  updateDate: Date;

  /** Creator of the resource */
  @ManyToOne(() => ProfessorEntity, user => user.resources, { eager: true, onDelete: 'SET NULL' })
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  creator: ProfessorEntity;

  /** File associated with the resource */
  @OneToOne(() => FileEntity, { eager: true })
  @JoinColumn({ name: 'fileId' })
  file: FileEntity;

  /** Id of the file associated with the resource */
  @Column({ name: 'fileId', type: 'varchar', nullable: true })
  fileId: string;

  /**
   * Original resource. Populated if the resource was copied
   * from another resource
   */
  @ManyToOne(() => ResourceEntity, res => res.borrowed, { nullable: true })
  @JoinColumn({ name: 'originalId' })
  @Exclude({ toClassOnly: true })
  original: ResourceEntity;

  /** Original resource id */
  @Column({ name: 'originalId', type: 'varchar', nullable: true })
  @Exclude({ toClassOnly: true })
  originalId: string;

  /** All of the resources that were issued from this resource */
  @OneToMany(() => ResourceEntity, res => res.original)
  borrowed: ResourceEntity[];

  /** Activities containing this resource */
  @OneToMany(() => ActivityEntity, act => act.resource)
  activities: ActivityEntity[];
}
