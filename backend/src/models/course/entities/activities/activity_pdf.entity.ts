import { ChildEntity } from 'typeorm';
import { ACTIVITY_TYPE, ActivityEntity } from '../activity.entity';
import { RESOURCE_TYPE } from '../../../resource/entities/resource.entity';

/**
 * Activity of type Pdf model in the database
 * @author Maxime Gazzé
 */
@ChildEntity(ACTIVITY_TYPE.PDF)
export class ActivityPdfEntity extends ActivityEntity {
  /** Allowed types of resources inside the activity */
  readonly allowedResources: RESOURCE_TYPE[] = [RESOURCE_TYPE.FILE];

  /** Mime types allowed as a resource inside the activity */
  acceptedMimeTypes = ['application/pdf', 'application/vnd.ms-excel'];
}
