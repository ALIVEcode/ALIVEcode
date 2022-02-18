import { Exclude } from 'class-transformer';
import { IsEmpty } from 'class-validator';
import { Entity, OneToOne, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { ActivityEntity } from './activity.entity';
import { CourseEntity } from './course.entity';
import { SectionEntity } from './section.entity';

@Entity()
export class CourseContent {
  @PrimaryGeneratedColumn('increment')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: number;

  @ManyToOne(() => CourseEntity, course => course.contents)
  course: CourseEntity;

  @ManyToOne(() => SectionEntity, section => section.contents)
  sectionParent: SectionEntity;

  @OneToOne(() => ActivityEntity, act => act.course_content)
  @JoinColumn()
  activity: ActivityEntity;

  @OneToOne(() => SectionEntity, sect => sect.course_content)
  @JoinColumn()
  section: SectionEntity;
}