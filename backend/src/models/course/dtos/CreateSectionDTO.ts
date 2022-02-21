import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { SectionEntity } from '../entities/section.entity';

export class CreateSectionDTO {
  @Type(() => SectionEntity)
  courseContent: SectionEntity;

  @IsNotEmpty()
  sectionParentId: string;
}