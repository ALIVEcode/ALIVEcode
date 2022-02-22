import { Exclude } from 'class-transformer';
import { IsEmpty, IsNotEmpty, Length, ValidateIf } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from 'typeorm';
import { CourseElementEntity } from './course_element.entity';

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

  @OneToMany(() => CourseElementEntity, content => content.sectionParent)
  @IsEmpty()
  elements: CourseElementEntity[];

  @ValidateIf((lst: any) => Array.isArray(lst) && lst.every(el => Number.isInteger(el)))
  @Column({ type: 'json', default: [] })
  @Exclude({ toClassOnly: true })
  @IsEmpty()
  elementsOrder: number[];

  @OneToOne(() => CourseElementEntity, el => el.section)
  @IsEmpty()
  courseElement: CourseElementEntity;
}
