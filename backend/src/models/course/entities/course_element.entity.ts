import { Exclude } from 'class-transformer';
import { IsEmpty } from 'class-validator';
import { Entity, OneToOne, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { ActivityEntity } from './activity.entity';
import { CourseEntity } from './course.entity';
import { SectionEntity } from './section.entity';

@Entity()
export class CourseElementEntity {
  @PrimaryGeneratedColumn('increment')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: number;

  /*****---Parents---*****/

  /** The course that the element belongs to */
  @ManyToOne(() => CourseEntity, course => course.elements)
  course: CourseEntity;

  /** If the section is not at top level (inside another section), it contains that parent section */
  @ManyToOne(() => SectionEntity, section => section.elements)
  sectionParent: SectionEntity;

  /*****---------------------------------*****/

  /*****---Elements (only one at a time)---*****/

  /** If the element is an activity **/
  @OneToOne(() => ActivityEntity, act => act.courseElement, { eager: true, onDelete: 'CASCADE' })
  activity: ActivityEntity;

  /** If the element is a section **/
  @OneToOne(() => SectionEntity, sect => sect.courseElement, { eager: true, onDelete: 'CASCADE' })
  section: SectionEntity;

  /*****-----------------------------------*****/
}