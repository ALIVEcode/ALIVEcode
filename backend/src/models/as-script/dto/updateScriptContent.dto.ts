import { IsNotEmpty } from "class-validator";

export class UpdateScriptContentDTO {
  @IsNotEmpty()
  content: string;
}