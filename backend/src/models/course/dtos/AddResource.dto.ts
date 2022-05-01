import { IsNotEmpty, IsUUID } from "class-validator";

/**
 * DTO to create a resource
 * @author Enric Soldevila
 */
export class AddResourceDTO {
  @IsNotEmpty()
  @IsUUID()
  resourceId: string;
}