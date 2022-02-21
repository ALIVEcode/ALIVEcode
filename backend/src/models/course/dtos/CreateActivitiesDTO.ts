import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ActivityEntity } from '../entities/activity.entity';

export class CreateActivityDTO {
  @IsNotEmpty()
  sectionParentId: string;

  @Type(() => ActivityEntity)
  courseContent: ActivityEntity;
}

export class CreateActivityLevelDTO extends CreateActivityDTO {
  levelId: string;
}

export class CreateActivityTheoryDTO extends CreateActivityDTO {}

export class CreateActivityVideoDTO extends CreateActivityDTO {}