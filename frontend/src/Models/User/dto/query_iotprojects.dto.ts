import { IsOptional } from 'class-validator';

export class QueryIoTProjects {
  @IsOptional()
  name?: string;
}