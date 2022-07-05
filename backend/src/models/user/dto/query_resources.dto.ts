import { Transform } from "class-transformer";
import { IsEnum, IsOptional} from 'class-validator';
import { SUBJECTS } from '../../../generics/types/sharedTypes';
import { RESOURCE_TYPE, pdfMimeTypes, wordMimeTypes, imageMimeTypes } from '../../resource/entities/resource.entity';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fileMimeTypesFilters = ['img', 'pdf', 'word'];

export class QueryResources {
  @IsOptional()
  name?: string;

  @IsOptional()
  @Transform(({ value: typesStr }) => {
    if (typeof typesStr === 'string') {
      const types = typesStr.split(',');
      const enumEntries = Object.entries(RESOURCE_TYPE);
      const enumTypes: RESOURCE_TYPE[] = [];
      types.forEach(s => {
        const found = enumEntries.find(entry => entry[1] === s);
        if (found) enumTypes.push(found[1]);
      });
      return enumTypes;
    }
    return undefined;
  })
  resourceTypes?: RESOURCE_TYPE[];

  @IsOptional()
  @Transform(({ value: typesStr }) => {
    if (typeof typesStr === 'string') {
      const types = typesStr.split(',');
      const mimeTypes: string[] = [];
      types.forEach(file => {
        switch (file) {
          case 'img':
            return mimeTypes.push(...imageMimeTypes);
          case 'pdf':
            return mimeTypes.push(...pdfMimeTypes);
          case 'word':
            return mimeTypes.push(...wordMimeTypes);
        }
      });
      return mimeTypes;
    }
    return undefined;
  })
  fileMimeTypes?: string[];

  @IsOptional()
  @IsEnum(SUBJECTS)
  subject?: SUBJECTS;
}