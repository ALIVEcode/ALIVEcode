import {
	faBrain,
	faClipboardList,
	faCode,
	faImage,
	faQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { faCloudsmith } from '@fortawesome/free-brands-svg-icons';
import { faFile, faVideo, faBook } from '@fortawesome/free-solid-svg-icons';
import { RESOURCE_TYPE } from '../Models/Resource/resource.entity';

export enum SUBJECTS {
	CODE = 'CO',
	IOT = 'IOT',
	AI = 'AI',
	OTHER = 'OT',
}

export const getSubjectIcon = (subject: SUBJECTS) => {
	switch (subject) {
		case SUBJECTS.CODE:
			return faCode;
		case SUBJECTS.IOT:
			return faCloudsmith;
		case SUBJECTS.AI:
			return faBrain;
		case SUBJECTS.OTHER:
			return faClipboardList;
	}
	return faCode;
};

export const getResourceIcon = (resourceType: RESOURCE_TYPE) => {
	switch (resourceType) {
		case RESOURCE_TYPE.FILE:
			return faFile;
		case RESOURCE_TYPE.IMAGE:
			return faImage;
		case RESOURCE_TYPE.CHALLENGE:
			return faCode;
		case RESOURCE_TYPE.VIDEO:
			return faVideo;
		case RESOURCE_TYPE.THEORY:
			return faBook;
	}
	return faQuestion;
};
