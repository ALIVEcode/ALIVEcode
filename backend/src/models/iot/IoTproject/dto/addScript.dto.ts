import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { AsScriptEntity } from '../../../as-script/entities/as-script.entity';

export class IoTProjectAddScriptDTO {
  @IsNotEmpty()
  @Type(() => AsScriptEntity)
  script: AsScriptEntity;

  @IsNotEmpty()
  routeId: string;
}