import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, Column } from 'typeorm';
import { ResourceEntity } from '../../../resource/entities/resource.entity';
import { CourseTemplateEntity } from './course_template.entity';

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

  @ManyToMany(() => CourseTemplateEntity)
  @JoinTable()
  templates: CourseTemplateEntity[];

  @ManyToMany(() => ResourceEntity)
  @JoinTable()
  resources: ResourceEntity[];
}