import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { ActivityEntity } from '../entities/activity.entity';

/**
 * DTO to create a generic activity (Data Transfer Object)
 * @author Enric Soldevila
 */
export class CreateActivityDTO {
  /** (Optional) Section to create the activity in */
  @IsOptional()
  sectionParentId?: string;

  /** Activity object to create */
  @Type(() => ActivityEntity)
  @ValidateNested()
  courseContent: ActivityEntity;
}

/**
 * DTO to create a level activity (Data Transfer Object)
 * @author Enric Soldevila
 */
export class CreateActivityLevelDTO extends CreateActivityDTO {
  /** Id of the level to show inside the actvity */
  levelId: string;
}

/**
 * DTO to create a theory activity (Data Transfer Object)
 * @author Enric Soldevila
 */
export class CreateActivityTheoryDTO extends CreateActivityDTO {}

/**
 * DTO to create a video activity (Data Transfer Object)
 * @author Enric Soldevila
 */
export class CreateActivityVideoDTO extends CreateActivityDTO {}