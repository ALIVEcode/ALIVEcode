import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested, ValidateIf } from 'class-validator';
import { ACTIVITY_TYPE } from '../entities/activity.entity';

/**
 * DTO to create the content inside of an activity in the database
 * @author Enric Soldevila
 */
export class CreateActivityCourseContent {
  /** Type of the activity */
  @IsNotEmpty()
  @ValidateIf((val: any) => Object.values(ACTIVITY_TYPE).includes(val))
  readonly type: ACTIVITY_TYPE;
}

/**
 * DTO to create a course element of type activity (Data Transfer Object)
 * @author Enric Soldevila
 */
export class CreateActivityDTO {
  /** (Optional) Section to create the activity in */
  @IsOptional()
  sectionParentId?: string;

  /** Name of the course element of type activity */
  @IsNotEmpty()
  name: string;

  /** Activity object to create */
  @ValidateNested()
  @Type(() => CreateActivityCourseContent)
  courseContent: CreateActivityCourseContent;
}

/**
 * DTO to create a course element of a challenge activity (Data Transfer Object)
 * @author Enric Soldevila
 */
export class CreateActivityChallengeDTO extends CreateActivityDTO {
  /** Id of the challenge to show inside the actvity */
  @IsNotEmpty()
  challengeId: string;
}

/**
 * DTO to create a course element of a theory activity (Data Transfer Object)
 * @author Enric Soldevila
 */
export class CreateActivityTheoryDTO extends CreateActivityDTO {}

/**
 * DTO to create a course element of a video activity (Data Transfer Object)
 * @author Enric Soldevila
 */
export class CreateActivityVideoDTO extends CreateActivityDTO {}

/**
 * DTO to create a course element of an assignment activity (Data Transfer Object)
 * @author Enric Soldevila
 */
export class CreateActivityAssignmentDTO extends CreateActivityDTO {}