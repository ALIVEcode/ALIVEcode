import { Exclude } from 'class-transformer';
import { IsEmpty, IsNotEmpty, ValidateIf } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, ManyToMany, JoinColumn } from 'typeorm';
import { CreatedByUser } from '../../../generics/entities/createdByUser.entity';
import { SUBJECTS } from '../../../generics/types/sharedTypes';
import { ClassroomEntity } from '../../classroom/entities/classroom.entity';
import { ProfessorEntity } from '../../user/entities/user.entity';
import { ActivityEntity } from './activity.entity';
import { CourseElementEntity } from './course_element.entity';
import { SectionEntity } from './section.entity';

export enum COURSE_DIFFICULTY {
  BEGINNER = 1,
  EASY = 2,
  MEDIUM = 3,
  ADVANCED = 4,
  HARD = 5,
  EXPERT = 6,
}

export enum COURSE_ACCESS {
  PUBLIC = 'PU', // can be found via a search
  UNLISTED = 'UN', // must be shared via a url
  RESTRICTED = 'RE', // limited to certain classes
  PRIVATE = 'PR', // only accessible to the creator
}

export type CourseContent = ActivityEntity | SectionEntity;

/**
 * Course model in the database
 * @author Enric Soldevila
 */
@Entity()
export class CourseEntity extends CreatedByUser {
  /** Creator of the course (Professor) */
  @Exclude({ toClassOnly: true })
  @ManyToOne(() => ProfessorEntity, professor => professor.courses, {
    eager: true,
    nullable: false,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'creatorId' })
  creator: ProfessorEntity;

  @Column({ name: 'creatorId', type: 'string', nullable: false })
  creatorId: string;

  // TODO : maybe hide the code
  /** Code to join the course (NOT USED YET) */
  @IsEmpty()
  @Column({ length: 10, unique: true, nullable: false })
  // The code consists of letters from a-z and numbers from 0-9 | case non-senstive
  code: string;

  /** Access to the course */
  @IsNotEmpty()
  @Column({ type: 'enum', enum: COURSE_ACCESS, default: COURSE_ACCESS.PRIVATE, nullable: false })
  access: COURSE_ACCESS;

  /** The subject of the course */
  @IsNotEmpty()
  @Column({ type: 'enum', enum: SUBJECTS, default: SUBJECTS.CODE, nullable: false })
  subject: SUBJECTS;

  /** CourseElements inside the course */
  @OneToMany(() => CourseElementEntity, content => content.course)
  elements: CourseElementEntity[];

  /** Display order of the CourseElements */
  @ValidateIf((lst: any) => Array.isArray(lst) && lst.every(el => Number.isInteger(el)))
  @Column({ type: 'json', default: [] })
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  elementsOrder: number[];

  /** Classes that the course is in */
  @Exclude({ toClassOnly: true })
  @ManyToMany(() => ClassroomEntity, classroom => classroom.courses, { onDelete: 'CASCADE' })
  classrooms: ClassroomEntity[];

  @Column({ default: 0, nullable: false })
  @Exclude()
  featuringScore: number;
}
