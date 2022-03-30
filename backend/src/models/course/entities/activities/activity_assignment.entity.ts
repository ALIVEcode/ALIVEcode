import { ChildEntity} from 'typeorm';
import { ACTIVITY_TYPE, ActivityEntity } from '../activity.entity';
import { RESOURCE_TYPE } from '../../../resource/entities/resource.entity';

/**
 * Activity of type assignment model in the database
 * @author Enric Solevila
 */
@ChildEntity(ACTIVITY_TYPE.ASSIGNMENT)
export class ActivityAssignmentEntity extends ActivityEntity {
  /** Allowed types of resources inside the activity */
  readonly allowedResources: RESOURCE_TYPE[] = [RESOURCE_TYPE.FILE];
}