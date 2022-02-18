import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { LevelEntity } from '../../../level/entities/level.entity';
import { ActivityEntity } from '../activity.entity';

@Entity()
export class ActivityLevelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'boolean' })
  mustBeCompleted: boolean;

  @ManyToOne(() => ActivityEntity, activity => activity.levels)
  activity: ActivityEntity;

  @ManyToOne(() => LevelEntity, level => level.activities, { eager: true })
  level: LevelEntity;
}