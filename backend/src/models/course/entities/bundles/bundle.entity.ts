import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ResourceEntity } from '../../../resource/entities/resource.entity';
import { CourseTemplateEntity } from './course_template.entity';
import { Exclude } from 'class-transformer';
import { ProfessorEntity } from '../../../user/entities/user.entity';

/**
 * Bundle model in the database
 * @author Enric Soldevila
 */
@Entity()
export class BundleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ nullable: false })
  price: number;

  @ManyToMany(() => CourseTemplateEntity, { eager: true })
  @JoinTable()
  courseTemplates: CourseTemplateEntity[];

  @ManyToMany(() => ResourceEntity, { eager: true })
  @JoinTable()
  resources: ResourceEntity[];

  @ManyToOne(() => ProfessorEntity, { nullable: false })
  @Exclude({ toClassOnly: true })
  creator: ProfessorEntity;

  @CreateDateColumn()
  @Exclude({ toClassOnly: true })
  creationDate: Date;

  @UpdateDateColumn()
  @Exclude({ toClassOnly: true })
  updateDate: Date;
}