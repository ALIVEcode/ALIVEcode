import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, TableInheritance, Column, OneToOne, JoinColumn } from 'typeorm';
import { IsEmpty, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { CourseElementEntity } from './course_element.entity';
import { Descendant } from 'slate';

export class ActivityContent {
  body: string;
}

export enum ACTIVITY_TYPE {
  THEORY = 'TH',
  CHALLENGE = 'CH',
  VIDEO = 'VI',
}

/**
 * Activity model in the database
 * @author Enric Soldevila, Mathis Laroche
 */
@Entity()
@TableInheritance({ column: 'type' })
export class ActivityEntity {
  /** Id of the activity (0, 1, 2, ..., n) */
  @PrimaryGeneratedColumn('increment')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: number;

  /** Type of the activity */
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  @Column({ type: 'enum', name: 'type', enum: ACTIVITY_TYPE, default: ACTIVITY_TYPE.THEORY })
  readonly type: ACTIVITY_TYPE;

  /** Header of the activity */
  @IsOptional()
  @Column({ nullable: true, default: null, type: 'json' })
  header: Descendant[];

  /** Footer of the activity */
  @IsOptional()
  @Column({ nullable: true, default: null, type: 'json' })
  footer: Descendant[];

  /** CourseElement attached to the activity */
  @OneToOne(() => CourseElementEntity, el => el.activity, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn()
  courseElement: CourseElementEntity;
}
