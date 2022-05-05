import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { ResourceEntity } from 'src/models/resource/entities/resource.entity';

export class CreateFileDTO {
  /** Creation date of the resource */
  @IsNotEmpty()
  originalname: string;

  /** Encoding type of the file */
  @IsNotEmpty()
  encoding: string;

  /** Mime type of the file */
  @IsNotEmpty()
  mimetype: string;

  /** Size of the file in bytes */
  @IsNotEmpty()
  size: number;

  /** The folder to which the file has been saved */
  @IsNotEmpty()
  destination: string;

  /** The name of the file within the destination */
  @IsNotEmpty()
  filename: string;

  /** The full path to the uploaded file */
  @IsNotEmpty()
  path: string;

  /** Resource with which the file is associated */
  // @IsOptional()
  // @ValidateNested()
  // @Type(() => ResourceEntity)
  // resource: ResourceEntity;
}
