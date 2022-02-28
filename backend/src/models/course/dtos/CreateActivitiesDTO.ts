import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested, ValidateIf, Length } from 'class-validator';
import { ACTIVITY_TYPE } from '../entities/activity.entity';

export class CreateActivityCourseContent {
  /** Type of the activity */
  @IsNotEmpty()
  @ValidateIf((val: any) => {
    const bool = Object.values(ACTIVITY_TYPE).includes(val);
    console.log(bool);
    return bool;
  })
  readonly type: ACTIVITY_TYPE;

  /** Name of the activity */
  @IsNotEmpty()
  @Length(1, 100)
  name: string;
}

/**
 * DTO to create a generic activity (Data Transfer Object)
 * @author Enric Soldevila
 */
export class CreateActivityDTO {
  /** (Optional) Section to create the activity in */
  @IsOptional()
  sectionParentId?: string;

  /** Activity object to create */
  @ValidateNested()
  @Type(() => CreateActivityCourseContent)
  courseContent: CreateActivityCourseContent;
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