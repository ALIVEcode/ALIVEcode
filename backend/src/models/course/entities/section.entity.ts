import { Exclude } from 'class-transformer';
import { IsEmpty, IsNotEmpty, Length } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { CourseElement } from './course_content.entity';

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

  @OneToMany(() => CourseElement, content => content.sectionParent)
  elements: CourseElement[];

  @OneToOne(() => CourseElement)
  course_elements: CourseElement;
}
