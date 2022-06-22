import { ChildEntity} from 'typeorm';
import { ACTIVITY_TYPE, ActivityEntity } from '../activity.entity';
import { RESOURCE_TYPE } from '../../../resource/entities/resource.entity';

/**
 * Activity of type video model in the database
 * @author Enric Solevila
 */
@ChildEntity(ACTIVITY_TYPE.VIDEO)
export class ActivityVideoEntity extends ActivityEntity {
  /** Allowed types of resources inside the activity */
  readonly allowedResources: [RESOURCE_TYPE, ...Array<string>] = [RESOURCE_TYPE.VIDEO];

  /** Mime types allowed as a resource inside the activity */
  acceptedMimeTypes = ['video/mp4', 'video/x-m4v', 'video/*'];
}