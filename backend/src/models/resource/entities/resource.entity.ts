import {
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  TableInheritance,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, MinLength, IsEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { SUBJECTS } from '../../../generics/types/sharedTypes';
import { ProfessorEntity } from '../../user/entities/user.entity';
import { OneToMany } from 'typeorm';

export enum RESOURCE_TYPE {
  VIDEO = 'VI',
  FILE = 'FI',
  IMAGE = 'IM',
  CHALLENGE = 'CH',
  THEORY = 'TH',
}

@Entity()
@TableInheritance({ column: 'type' })
export class ResourceEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  /** Type of the resource */
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  @Column({ type: 'enum', name: 'type', enum: RESOURCE_TYPE, default: RESOURCE_TYPE.FILE })
  readonly type: RESOURCE_TYPE;

  @Column({ type: 'enum', enum: SUBJECTS, default: SUBJECTS.OTHER })
  @IsEmpty()
  category: SUBJECTS;

  @CreateDateColumn()
  @IsEmpty()
  creationDate: Date;

  @UpdateDateColumn()
  @IsEmpty()
  updateDate: Date;

  @ManyToOne(() => ProfessorEntity, user => user.resources, { eager: true, onDelete: 'SET NULL' })
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  creator: ProfessorEntity;

  @ManyToOne(() => ResourceEntity, res => res.borrowed)
  original: ResourceEntity;

  @OneToMany(() => ResourceEntity, res => res.original)
  borrowed: ResourceEntity[];
}