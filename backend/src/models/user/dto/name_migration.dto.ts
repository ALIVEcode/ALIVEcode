import { IsNotEmpty } from "class-validator";

export class NameMigrationDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;
}