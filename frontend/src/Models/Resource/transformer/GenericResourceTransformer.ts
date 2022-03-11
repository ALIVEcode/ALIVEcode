import { Type } from 'class-transformer';
import {
	RESOURCE_TYPE,
	Resource,
	DifferentResources,
} from '../resource.entity';
import { ResourceChallenge } from '../resource_challenge.entity';
import { ResourceTheory } from '../resource_theory.entity';
import { ResourceFile } from '../resource_file.entity';
import { ResourceImage } from '../resource_image.entity';
import { ResourceVideo } from '../resource_video.entity';

export class GenericResourceTransformer {
	@Type(() => Resource, {
		discriminator: {
			property: 'type',
			subTypes: [
				{ name: RESOURCE_TYPE.CHALLENGE, value: ResourceChallenge },
				{ name: RESOURCE_TYPE.THEORY, value: ResourceTheory },
				{ name: RESOURCE_TYPE.FILE, value: ResourceFile },
				{ name: RESOURCE_TYPE.IMAGE, value: ResourceImage },
				{ name: RESOURCE_TYPE.VIDEO, value: ResourceVideo },
			],
		},
	})
	resource: DifferentResources;
}
