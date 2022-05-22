import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { AsScriptEntity } from '../../../as-script/entities/as-script.entity';

export class IoTProjectAddRouteScriptDTO {
  @IsNotEmpty()
  @Type(() => AsScriptEntity)
  @ValidateNested()
  script: AsScriptEntity;

  @IsString()
  @IsNotEmpty()
  routeId: string;
}

export class IoTProjectAddScriptDTO {
  @IsNotEmpty()
  @Type(() => AsScriptEntity)
  @ValidateNested()
  script: AsScriptEntity;
}

export class IoTProjectSetScriptOfObject {
  @IsNotEmpty()
  @IsString()
  scriptId: string;
}