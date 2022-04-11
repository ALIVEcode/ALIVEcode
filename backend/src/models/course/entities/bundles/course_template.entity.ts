import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CourseEntity } from '../course.entity';

/**
 * CourseTemplate model in the database
 * @author Enric Soldevila
 */
@Entity()
export class CourseTemplateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'bool' })
  isPublic: boolean;

  @ManyToOne(() => CourseEntity, { nullable: false })
  @JoinColumn({ name: 'courseId' })
  course: CourseEntity;

  @Column({ name: 'courseId', type: 'varchar', nullable: false })
  courseId: string;
}