import { IsOptional } from 'class-validator';

export class UpdateCourseElementDTO {
  @IsOptional()
  name: string;
}