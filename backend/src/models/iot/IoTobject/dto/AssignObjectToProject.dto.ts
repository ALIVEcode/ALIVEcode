import { IsString, IsNotEmpty } from 'class-validator';

export class ConnectionObjectToProjectDTO {
  @IsString()
  @IsNotEmpty()
  projectId: string;
}