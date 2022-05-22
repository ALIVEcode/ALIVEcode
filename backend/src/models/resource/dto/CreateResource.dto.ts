import { Type } from "class-transformer";
import { IsDefined, IsEnum, IsNotEmpty, IsNotEmptyObject, ValidateNested } from 'class-validator';
import { ResourceEntity, RESOURCE_TYPE, DifferentResources } from '../entities/resource.entity';
import { ResourceChallengeEntity } from '../entities/resources/resource_challenge.entity';
import { ResourceFileEntity } from '../entities/resources/resource_file.entity';
import { ResourcePdfEntity } from '../entities/resources/resource_pdf.entity';
import { ResourceTheoryEntity } from '../entities/resources/resource_theory.entity';
import { ResourceVideoEntity } from '../entities/resources/resource_video.entity';

export class CreateResourceDTOSimple {
  @IsNotEmpty()
  @IsEnum(RESOURCE_TYPE)
  type: RESOURCE_TYPE;

  @IsDefined()
  @IsNotEmptyObject()
  resource: DifferentResources;
}

export class CreateResourceDTO {
  @IsNotEmpty()
  @IsEnum(RESOURCE_TYPE)
  type: RESOURCE_TYPE;

  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @Type(() => ResourceEntity, {
    discriminator: {
      property: 'type',
      subTypes: [
        { name: RESOURCE_TYPE.CHALLENGE, value: ResourceChallengeEntity },
        { name: RESOURCE_TYPE.THEORY, value: ResourceTheoryEntity },
        { name: RESOURCE_TYPE.FILE, value: ResourceFileEntity },
        { name: RESOURCE_TYPE.PDF, value: ResourcePdfEntity },
        { name: RESOURCE_TYPE.VIDEO, value: ResourceVideoEntity },
      ],
    },
  })
  resource: DifferentResources;
}
