import { Type } from 'class-transformer';
import { Column, ChildEntity } from 'typeorm';
import { ActivityEntity, ACTIVIY_TYPE } from '../activity.entity';

export class ActivityContent {
  body: string;
}

@ChildEntity(ACTIVIY_TYPE.THEORY)
export class ActivityTheoryEntity extends ActivityEntity {
  @Column({ type: 'json', default: {} })
  @Type(() => ActivityContent)
  content: ActivityContent;
}