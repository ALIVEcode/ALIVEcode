import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, TableInheritance, Column, OneToOne, JoinColumn } from 'typeorm';
import { IsEmpty, IsNotEmpty, Length } from 'class-validator';
import { CourseElementEntity } from './course_element.entity';

export class ActivityContent {
  body: string;
}

export enum ACTIVITY_TYPE {
  THEORY = 'TH',
  LEVEL = 'LE',
  VIDEO = 'VI',
}

/**
 * Activity model in the database
 * @author Enric Soldevila
 */
@Entity()
@TableInheritance({ column: 'type' })
export class ActivityEntity {
  /** Id of the activity (0, 1, 2, ..., n) */
  @PrimaryGeneratedColumn('increment')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: number;

  /*
  @ManyToOne(() => SectionEntity, section => section.activities)
  @IsEmpty()
  section: SectionEntity;
  */

  /** Type of the activity */
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  @Column({ type: 'enum', name: 'type', enum: ACTIVITY_TYPE, default: ACTIVITY_TYPE.THEORY })
  readonly type: ACTIVITY_TYPE;

  /** Name of the activity */
  @IsNotEmpty()
  @Column({ nullable: false })
  @Length(1, 100)
  name: string;

  /** CourseElement attached to the activity */
  @OneToOne(() => CourseElementEntity, el => el.activity, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn()
  courseElement: CourseElementEntity;
}