import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, TableInheritance, Column, OneToOne } from 'typeorm';
import { IsEmpty, IsNotEmpty, Length } from 'class-validator';
import { CourseElementEntity } from './course_element.entity';

export class ActivityContent {
  body: string;
}

export enum ACTIVIY_TYPE {
  THEORY,
  LEVEL,
  VIDEO,
}

@Entity()
@TableInheritance({ column: 'type' })
export class ActivityEntity {
  @PrimaryGeneratedColumn('increment')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: number;

  /*
  @ManyToOne(() => SectionEntity, section => section.activities)
  @IsEmpty()
  section: SectionEntity;
  */

  @Exclude({ toClassOnly: true })
  @IsEmpty()
  @Column({ type: 'enum', name: 'type', enum: ACTIVIY_TYPE, default: ACTIVIY_TYPE.THEORY })
  readonly type: ACTIVIY_TYPE;

  @IsNotEmpty()
  @Column({ nullable: false })
  @Length(1, 100)
  name: string;

  @OneToOne(() => CourseElementEntity)
  course_element: CourseElementEntity;
}