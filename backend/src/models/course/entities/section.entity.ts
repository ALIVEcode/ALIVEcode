import { Exclude } from 'class-transformer';
import { IsEmpty, IsNotEmpty, Length } from 'class-validator';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { CourseEntity } from './course.entity';
import { CourseContent } from './course_content.entity';

@Entity()
export class SectionEntity {
  @PrimaryGeneratedColumn('increment')
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  id: number;

  @IsNotEmpty()
  @Column({ nullable: false })
  @Length(3, 100)
  name: string;

  /*@OneToMany(() => SectionEntity, section => section.sectionParent)
  @JoinTable()
  @IsEmpty()
  sections?: SectionEntity[];

  @ManyToOne(() => SectionEntity, section => section.sections)
  @IsEmpty()
  sectionParent?: SectionEntity;*/

  @ManyToOne(() => CourseEntity, course => course.sections, { onDelete: 'CASCADE' })
  @IsEmpty()
  course: CourseEntity;

  @OneToMany(() => CourseContent, content => content.sectionParent)
  contents: CourseContent[];

  @OneToOne(() => CourseContent)
  course_content: CourseContent;
}
