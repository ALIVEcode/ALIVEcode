import { IsOptional } from "class-validator";

export class QueryDTO {
  @IsOptional()
  txt?: string;
}