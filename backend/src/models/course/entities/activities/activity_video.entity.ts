import { ChildEntity} from 'typeorm';
import { ACTIVITY_TYPE, ActivityEntity } from '../activity.entity';
import { IsNotEmpty } from 'class-validator';

/**
 * Activity of type Level model in the database
 * @author Enric Solevila
 */
@ChildEntity(ACTIVITY_TYPE.VIDEO)
export class ActivityVideoEntity extends ActivityEntity {
  /** Reference to the level to display */
  @IsNotEmpty()
  video: string;
}