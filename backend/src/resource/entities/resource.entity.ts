import {
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  Entity,
  TableInheritance,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNotEmpty, MinLength, IsEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ProfessorEntity } from '../../models/user/entities/professor.entity';
import { SUBJECTS } from '../../generics/types/sharedTypes';

export enum RESOURCE_TYPE {
  VIDEO,
  FILE,
  IMAGE,
  LEVEL,
}

@Entity()
@TableInheritance({ column: { type: 'enum', name: 'type', enum: RESOURCE_TYPE } })
export class ResourceEntity {
  @PrimaryGeneratedColumn('uuid')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  @MinLength(1)
  name: string;

  @Column({ default: SUBJECTS.OTHER, enum: SUBJECTS })
  category: SUBJECTS;

  @CreateDateColumn()
  creationDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  @Column({ nullable: false, enum: RESOURCE_TYPE })
  type: RESOURCE_TYPE;

  @ManyToOne(() => ProfessorEntity, user => user.resources, { eager: true, onDelete: 'SET NULL' })
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  creator: ProfessorEntity;

  @ManyToMany(() => ResourceEntity, resource => resource.original, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  original: ResourceEntity;
}
