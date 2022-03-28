import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SUBJECTS } from '../../../generics/types/sharedTypes';
import { RESOURCE_TYPE } from '../../resource/entities/resource.entity';

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
  types?: RESOURCE_TYPE[];

  @IsOptional()
  @IsEnum(SUBJECTS)
  subject?: SUBJECTS;
}