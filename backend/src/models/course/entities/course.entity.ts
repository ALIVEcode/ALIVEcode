import { Exclude } from 'class-transformer';
import { IsEmpty, IsNotEmpty, ValidateIf } from 'class-validator';
import { Column, Entity, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { CreatedByUser } from '../../../generics/entities/createdByUser.entity';
import { ClassroomEntity } from '../../classroom/entities/classroom.entity';
import { CourseElementEntity } from './course_element.entity';
import { ProfessorEntity } from '../../user/entities/user.entity';
import { ActivityEntity } from './activity.entity';
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

export enum COURSE_SUBJECT {
  INFORMATIC = 'IN',
  AI = 'AI',
  MATH = 'MA',
  SCIENCE = 'SC',
}

export type CourseContent = ActivityEntity | SectionEntity;

@Entity()
export class CourseEntity extends CreatedByUser {
  @Exclude({ toClassOnly: true })
  @ManyToOne(() => ProfessorEntity, professor => professor.courses, { eager: true, onDelete: 'SET NULL' })
  creator: ProfessorEntity;

  // TODO : maybe hide the code
  @IsEmpty()
  @Column({ length: 10, unique: true, nullable: false })
  // The code consists of letters from a-z and numbers from 0-9 | case non-senstive
  code: string;

  @IsNotEmpty()
  @Column({ enum: COURSE_DIFFICULTY, nullable: false })
  difficulty: COURSE_DIFFICULTY;

  @IsNotEmpty()
  @Column({ enum: COURSE_ACCESS, nullable: false })
  access: COURSE_ACCESS;

  @IsNotEmpty()
  @Column({ enum: COURSE_SUBJECT, nullable: false })
  subject: COURSE_SUBJECT;

  @OneToMany(() => CourseElementEntity, content => content.courseParent)
  elements: CourseElementEntity[];

  @ValidateIf((lst: any) => Array.isArray(lst) && lst.every(el => Number.isInteger(el)))
  @Column({ type: 'json', default: [] })
  elements_order: number[];

  @Exclude({ toClassOnly: true })
  @ManyToMany(() => ClassroomEntity, classroom => classroom.courses)
  classrooms: ClassroomEntity[];
}
