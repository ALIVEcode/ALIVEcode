import { IsNotEmpty, IsUUID } from "class-validator";

export class AddResourceDTO {
  @IsNotEmpty()
  @IsUUID()
  resourceId: string;
}