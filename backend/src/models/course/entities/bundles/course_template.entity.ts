import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { ProfessorEntity } from '../../../user/entities/user.entity';
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

  @Column({ type: 'bool', default: false, nullable: false })
  isPublic: boolean;

  @ManyToOne(() => CourseEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: CourseEntity;

  @Column({ name: 'courseId', type: 'varchar', nullable: false })
  courseId: string;

  @ManyToMany(() => ProfessorEntity, prof => prof.courseTemplates)
  owners: ProfessorEntity[];
}