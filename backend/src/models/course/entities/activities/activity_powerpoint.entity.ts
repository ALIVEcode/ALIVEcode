import { ChildEntity} from 'typeorm';
import { ACTIVITY_TYPE, ActivityEntity } from '../activity.entity';
import { RESOURCE_TYPE } from '../../../resource/entities/resource.entity';

/**
 * Activity of type powerpoint model in the database
 * @author Enric Solevila
 */
@ChildEntity(ACTIVITY_TYPE.POWERPOINT)
export class ActivityPowerPointEntity extends ActivityEntity {
  /** Allowed types of resources inside the activity */
  readonly allowedResources: [RESOURCE_TYPE, ...Array<string>] = [RESOURCE_TYPE.FILE, 'powerpoint'];

  /** Mime types allowed as a resource inside the activity */
  acceptedMimeTypes = [
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ];
}