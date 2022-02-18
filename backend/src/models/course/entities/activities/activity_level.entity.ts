import { ChildEntity, OneToMany } from 'typeorm';
import { ACTIVIY_TYPE, ActivityEntity } from '../activity.entity';
import { LevelEntity } from '../../../level/entities/level.entity';

@ChildEntity(ACTIVIY_TYPE.LEVEL)
export class ActivityLevelEntity extends ActivityEntity {
  @OneToMany(() => LevelEntity, level => level.activities)
  level: LevelEntity;
}