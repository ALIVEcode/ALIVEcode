import { IsOptional } from "class-validator";

export class ClassroomQueryDTO {
  @IsOptional()
  txt?: string;
}