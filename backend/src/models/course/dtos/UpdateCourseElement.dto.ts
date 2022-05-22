import { IsOptional } from 'class-validator';

/**
 * DTO to update a course element
 * @author Enric Soldevila
 */
export class UpdateCourseElementDTO {
  /** New name for the course element */
  @IsOptional()
  name?: string;

  @IsOptional()
  isVisible?: boolean
}