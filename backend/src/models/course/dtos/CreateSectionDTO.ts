import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { SectionEntity } from '../entities/section.entity';

/**
 * DTO to create a section (Data Transfer Object)
 * @author Enric Soldevila
 */
export class CreateSectionDTO {
  /** (Optional) Section to create the activity in */
  @IsOptional()
  sectionParentId?: string;

  /** Section object to create */
  @ValidateNested()
  @Type(() => SectionEntity)
  courseContent: SectionEntity;
}