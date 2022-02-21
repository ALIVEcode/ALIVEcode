import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { SectionEntity } from '../entities/section.entity';

export class CreateSectionDTO {
  @ValidateNested()
  @Type(() => SectionEntity)
  courseContent: SectionEntity;

  @IsOptional()
  sectionParentId?: string;
}