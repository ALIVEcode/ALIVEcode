import { Type } from 'class-transformer';
import { Column, ChildEntity } from 'typeorm';
import { ACTIVITY_TYPE, ActivityEntity } from '../activity.entity';

export class ActivityContent {
  body: string;
}

/**
 * Activity of type theory model in the database
 * @deprecated Needs to be redone
 * @author Enric Solevila
 */
@ChildEntity(ACTIVITY_TYPE.THEORY)
export class ActivityTheoryEntity extends ActivityEntity {
  /** Content inside the theory activity (markdown) */
  @Column({ type: 'json', default: {} })
  @Type(() => ActivityContent)
  content: ActivityContent;
}