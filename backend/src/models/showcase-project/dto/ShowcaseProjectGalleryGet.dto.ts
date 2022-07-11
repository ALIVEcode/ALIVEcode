import { IsEnum, IsNotEmpty } from 'class-validator';
import { SUBJECTS } from '../../../generics/types/sharedTypes';

export class ShowcaseProjectGalleryGetDTO {
  @IsEnum(SUBJECTS)
  @IsNotEmpty()
  subject: SUBJECTS;

  @IsNotEmpty()
  nbItems: number;
}
