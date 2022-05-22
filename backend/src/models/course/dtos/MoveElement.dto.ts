import { IsNotEmpty} from 'class-validator';

/**
 * DTO to move an element inside a course
 * @author Enric Soldevila
 */
export class MoveElementDTO {
  @IsNotEmpty()
  elementId: string;

  @IsNotEmpty()
  parentId: string;

  @IsNotEmpty()
  index: number;
}