import { IsNotEmpty} from 'class-validator';

export class MoveElementDTO {
  @IsNotEmpty()
  elementId: string;

  @IsNotEmpty()
  parentId: string;

  @IsNotEmpty()
  index: number;
}