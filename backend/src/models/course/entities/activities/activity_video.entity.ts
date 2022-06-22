import { ChildEntity} from 'typeorm';
import { ACTIVITY_TYPE, ActivityEntity } from '../activity.entity';
import { RESOURCE_TYPE } from '../../../resource/entities/resource.entity';

export const acceptedVideoMimeTypes = [
  'video/mp4',
  'video/x-m4v',
  'video/quicktime',
  'video/x-ms-wmv',
  'video/x-matroska',
  'video/mpeg',
  'video/ogg',
  'video/mp2t',
  'video/x-ms-asf',
];

/**
 * Activity of type video model in the database
 * @author Enric Solevila
 */
@ChildEntity(ACTIVITY_TYPE.VIDEO)
export class ActivityVideoEntity extends ActivityEntity {
  /** Allowed types of resources inside the activity */
  readonly allowedResources: [RESOURCE_TYPE, ...Array<string>] = [RESOURCE_TYPE.VIDEO];

  /** Mime types allowed as a resource inside the activity */
  acceptedMimeTypes = acceptedVideoMimeTypes;
}