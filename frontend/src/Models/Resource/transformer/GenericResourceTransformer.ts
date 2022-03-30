import { Type } from 'class-transformer';
import {
	RESOURCE_TYPE,
	Resource,
	DifferentResources,
} from '../resource.entity';
import { ResourceFile } from '../resource_file.entity';
import { ResourceImage } from '../resource_image.entity';
import { ResourceTheory } from '../resource_theory.entity';
import { ResourceVideo } from '../resource_video.entity';
import { ResourceChallenge } from '../resource_challenge.entity';

/**
 * DTO transformer for transforming to instance a generic Resource object
 */
export class GenericResourceTransformer {
	@Type(obj => {
		switch (obj?.object.resource.type) {
			case RESOURCE_TYPE.FILE:
				return ResourceFile;
			case RESOURCE_TYPE.IMAGE:
				return ResourceImage;
			case RESOURCE_TYPE.THEORY:
				return ResourceTheory;
			case RESOURCE_TYPE.VIDEO:
				return ResourceVideo;
			case RESOURCE_TYPE.CHALLENGE:
				return ResourceChallenge;
		}
		return Resource;
	})
	resource: DifferentResources;
}
