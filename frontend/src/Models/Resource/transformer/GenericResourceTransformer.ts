import { Type } from 'class-transformer';
import {
	RESOURCE_TYPE,
	Resource,
	DifferentResources,
} from '../resource.entity';
import { ResourceFile } from '../resources/resource_file.entity';
import { ResourceTheory } from '../resources/resource_theory.entity';
import { ResourceVideo } from '../resources/resource_video.entity';
import { ResourceChallenge } from '../resources/resource_challenge.entity';

/**
 * DTO transformer for transforming to instance a generic Resource object
 */
export class GenericResourceTransformer {
	@Type(obj => {
		switch (obj?.object.resource.type) {
			case RESOURCE_TYPE.FILE:
				return ResourceFile;
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
