import { IsDate } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CourseEntity } from './course.entity';
import { Exclude } from 'class-transformer';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class CourseHistoryEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ type: 'timestamp' })
  @IsDate()
  lastInteraction: Date;

  @ManyToOne(() => CourseEntity)
  @Exclude({ toClassOnly: true })
  course: CourseEntity;

  @ManyToOne(() => UserEntity)
  @Exclude({ toClassOnly: true })
  user: UserEntity;
}
