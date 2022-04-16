import { Exclude } from 'class-transformer';
import { IsEmpty, IsNotEmpty, Length } from 'class-validator';
import { Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, Column, JoinColumn } from 'typeorm';
import { ActivityEntity } from './activity.entity';
import { CourseEntity } from './course.entity';
import { SectionEntity } from './section.entity';

/**
 * CourseElement model in the database
 * @author Enric Soldevila, Mathis Laroche
 */
@Entity()
export class CourseElementEntity {
  /** Id of the CourseElement (0, 1, 2, ..., n) */
  @PrimaryGeneratedColumn('increment')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: number;

  /** Name of the element */
  @IsNotEmpty()
  @Column({ nullable: false })
  @Length(3, 100)
  name: string;

  @IsNotEmpty()
  @Column({ nullable: false, default: true })
  isVisible: boolean;

  /*****---Parents---*****/

  /** The course that the element belongs to */
  @ManyToOne(() => CourseEntity, course => course.elements, { nullable: false })
  @JoinColumn({ name: 'courseId' })
  course: CourseEntity;

  @Column({ name: 'courseId', type: 'varchar', nullable: false })
  courseId: string;

  /** If the section is not at top level (inside another section), it contains that parent section */
  @ManyToOne(() => SectionEntity, section => section.elements, { onDelete: 'CASCADE' })
  sectionParent: SectionEntity;

  /*****---------------------------------*****/

  /*****---Elements (only one at a time)---*****/

  /** If the element is an activity */
  @OneToOne(() => ActivityEntity, act => act.courseElement, { eager: true, onDelete: 'CASCADE' })
  activity: ActivityEntity;

  /** If the element is a section */
  @OneToOne(() => SectionEntity, sect => sect.courseElement, { eager: true, onDelete: 'CASCADE' })
  section: SectionEntity;

  /*****-----------------------------------*****/

  get parent() {
    return this.sectionParent ?? this.course;
  }
}