import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { ResourceEntity, RESOURCE_TYPE, DifferentResources } from '../entities/resource.entity';
import { ResourceChallengeEntity } from '../entities/resource_challenge.entity';
import { ResourceFileEntity } from '../entities/resource_file.entity';
import { ResourceImageEntity } from '../entities/resource_image.entity';
import { ResourceTheoryEntity } from '../entities/resource_theory.entity';
import { ResourceVideoEntity } from '../entities/resource_video.entity';

export class CreateResourceDTO {
  @IsNotEmpty()
  @IsEnum(RESOURCE_TYPE)
  type: RESOURCE_TYPE;

  @ValidateNested()
  @Type(() => ResourceEntity, {
    discriminator: {
      property: 'type',
      subTypes: [
        { name: RESOURCE_TYPE.CHALLENGE, value: ResourceChallengeEntity },
        { name: RESOURCE_TYPE.THEORY, value: ResourceTheoryEntity },
        { name: RESOURCE_TYPE.FILE, value: ResourceFileEntity },
        { name: RESOURCE_TYPE.IMAGE, value: ResourceImageEntity },
        { name: RESOURCE_TYPE.VIDEO, value: ResourceVideoEntity },
      ],
    },
  })
  resource: DifferentResources;
}