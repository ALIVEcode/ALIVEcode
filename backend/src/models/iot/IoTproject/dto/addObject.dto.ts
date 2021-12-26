import { IsNotEmpty } from "class-validator";

export class AddObjectDTO {
  @IsNotEmpty()
  id: string;
}