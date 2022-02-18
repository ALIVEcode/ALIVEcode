import { Exclude } from 'class-transformer';
import { IsNotEmpty, Length, Matches } from 'class-validator';
import { ChildEntity, Column, OneToMany, RelationId } from 'typeorm';
import { UserEntity } from './user.entity';
import { ClassroomEntity } from '../../classroom/entities/classroom.entity';
import { CourseEntity } from '../../course/entities/course.entity';
import { ResourceEntity } from '../../../resource/entities/resource.entity';

@ChildEntity()
export class ProfessorEntity extends UserEntity {
  @Column()
  @IsNotEmpty()
  @Length(3, 25)
  @Matches(/^[A-Za-z]*$/, { message: 'form.firstName.error.match' })
  firstName: string;

  @Column()
  @IsNotEmpty()
  @Length(3, 25)
  @Matches(/^[A-Za-z]*$/, { message: 'form.lastName.error.match' })
  lastName: string;

  @Exclude({ toClassOnly: true })
  @OneToMany(() => ClassroomEntity, classroom => classroom.creator, { cascade: true })
  classrooms: ClassroomEntity[];

  @Exclude({ toClassOnly: true })
  @OneToMany(() => CourseEntity, course => course.creator, { cascade: true })
  courses: CourseEntity[];

  @Exclude({ toClassOnly: true })
  @OneToMany(() => ResourceEntity, resource => resource.creator)
  resources: ResourceEntity[];
}
