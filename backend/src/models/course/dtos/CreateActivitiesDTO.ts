import { ActivityEntity } from '../entities/activity.entity';

export class CreateActivityLevelDTO extends ActivityEntity {
  level_id: string;
}

export class CreateActivityTheoryDTO extends ActivityEntity {}

export class CreateActivityVideoDTO extends ActivityEntity {}