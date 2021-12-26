import { Exclude } from 'class-transformer';
import { IsEmpty, IsNotEmpty, Length } from 'class-validator';
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { CourseEntity } from './course.entity';
import { ActivityEntity } from './activity.entity';

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

  @ManyToMany(() => ActivityEntity)
  @JoinTable()
  @IsEmpty()
  activities?: ActivityEntity[];

  @ManyToOne(() => CourseEntity, course => course.sections, { onDelete: 'CASCADE' })
  @IsEmpty()
  course: CourseEntity;
}