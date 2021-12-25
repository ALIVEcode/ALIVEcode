import { IsArray, IsEnum, IsObject, IsOptional } from 'class-validator';

enum CompileStatus {
  INTERRUPT = 'interrupted',
}

export class CompileDTO {
  @IsOptional()
  backendCompiling: boolean;

  @IsOptional()
  lines: string;

  @IsOptional()
  @IsEnum(CompileStatus)
  status?: CompileStatus;

  @IsOptional()
  idToken?: string;

  @IsOptional()
  @IsArray()
  responseData?: string[];

  @IsOptional()
  @IsObject()
  context?: { [val: string]: any };
}