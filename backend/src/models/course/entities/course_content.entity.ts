import { Exclude } from 'class-transformer';
import { IsEmpty } from 'class-validator';
import { Entity, OneToOne, ManyToOne, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityEntity } from './activity.entity';
import { CourseEntity } from './course.entity';
import { SectionEntity } from './section.entity';
/*import { SectionEntity } from './section.entity';
import { CourseEntity } from './course.entity';
import { ActivityEntity } from './activity.entity';
import { IsEmpty } from 'class-validator';
*/
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

  @OneToOne(() => ActivityEntity)
  @JoinTable()
  activity: ActivityEntity;

  @OneToOne(() => SectionEntity)
  @JoinTable()
  section: SectionEntity;
}