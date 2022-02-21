import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { ActivityEntity } from '../entities/activity.entity';

export class CreateActivityDTO {
  @IsOptional()
  sectionParentId?: string;

  @Type(() => ActivityEntity)
  @ValidateNested()
  courseContent: ActivityEntity;
}

export class CreateActivityLevelDTO extends CreateActivityDTO {
  levelId: string;
}

export class CreateActivityTheoryDTO extends CreateActivityDTO {}

export class CreateActivityVideoDTO extends CreateActivityDTO {}