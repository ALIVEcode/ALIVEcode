import { IsNotEmpty, IsOptional } from 'class-validator';
import { ChildEntity, Column } from 'typeorm';
import { ResourceEntity, RESOURCE_TYPE } from '../resource.entity';

/**
 * Activity of type Pdf model in the database
 * @author Maxime Gazzé
 */
@ChildEntity(RESOURCE_TYPE.PDF)
export class ResourcePdfEntity extends ResourceEntity {
  /** Url of the pdf file */
  @Column()
  @IsNotEmpty()
  url: string;

  /** File extension */
  @Column()
  @IsOptional()
  extension: string;
}
