import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { SectionEntity } from '../entities/section.entity';

/**
 * DTO to create a section (Data Transfer Object)
 * @author Enric Soldevila
 */
export class CreateSectionDTO {
  /** (Optional) Section to create the activity in */
  @IsOptional()
  sectionParentId?: string;

  @IsNotEmpty()
  name: string;

  /** Section object to create */
  @ValidateNested()
  @Type(() => SectionEntity)
  courseContent: SectionEntity;
}