import { IsOptional } from 'class-validator';

export class QueryIoTObjects {
  @IsOptional()
  name?: string;
}