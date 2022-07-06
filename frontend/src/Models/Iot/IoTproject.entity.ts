import { CreatedByUser } from '../Generics/createdByUser.entity';
import { User } from '../User/user.entity';
import { IotRoute } from './IoTroute.entity';
import api from '../api';
import {
	IOT_COMPONENT_TYPE,
	IoTComponent,
} from './IoTProjectClasses/IoTComponent';
import {
	Transform,
	plainToClass,
	TransformationType,
	Type,
} from 'class-transformer';
import { IoTButton } from './IoTProjectClasses/Components/IoTButton';
import { IoTProgressBar } from './IoTProjectClasses/Components/IoTProgressBar';
import { IoTLogs } from './IoTProjectClasses/Components/IoTLogs';
import { IoTLed } from './IoTProjectClasses/Components/IoTLed';
import { IoTLabel } from './IoTProjectClasses/Components/IoTLabel';
import { IoTBuzzer } from './IoTProjectClasses/Components/IoTBuzzer';
import { isArray } from 'tone';
import { IoTTrafficLight } from './IoTProjectClasses/Components/IoTTrafficLight';
import { IoTProjectObject } from './IoTprojectObject.entity';
import { ChallengeProgression } from '../Challenge/challenge_progression.entity';
import { AsScript } from '../AsScript/as-script.entity';

export enum IOTPROJECT_INTERACT_RIGHTS {
	ANYONE = 'AN',
	COLLABORATORS = 'CO',
	PRIVATE = 'PR',
}

export enum IOTPROJECT_ACCESS {
	PUBLIC = 'PU', // can be found via a search
	UNLISTED = 'UN', // must be shared via a url
	RESTRICTED = 'RE', // limited to certain classes
	PRIVATE = 'PR', // only accessible to the creator
}

export const parseIoTProjectLayout = (layout: IoTProjectLayout) => {
	const parsedComponents: IoTComponent[] = [];
	layout.components.forEach((c: IoTComponent) => {
		if (c.type === IOT_COMPONENT_TYPE.BUTTON) c = plainToClass(IoTButton, c);
		if (c.type === IOT_COMPONENT_TYPE.PROGRESS_BAR)
			c = plainToClass(IoTProgressBar, c);
		if (c.type === IOT_COMPONENT_TYPE.LOGS) c = plainToClass(IoTLogs, c);
		if (c.type === IOT_COMPONENT_TYPE.LED) c = plainToClass(IoTLed, c);
		if (c.type === IOT_COMPONENT_TYPE.LABEL) c = plainToClass(IoTLabel, c);
		if (c.type === IOT_COMPONENT_TYPE.BUZZER) c = plainToClass(IoTBuzzer, c);
		if (c.type === IOT_COMPONENT_TYPE.TRAFFIC_LIGHT)
			c = plainToClass(IoTTrafficLight, c);

		c && parsedComponents.push(c);
	});

	layout.components = parsedComponents;
	return layout;
};
export class IoTProjectLayout {
	@Transform(({ value: components, type }) => {
		if (type !== TransformationType.PLAIN_TO_CLASS || !components) {
			return components;
		}
		return parseIoTProjectLayout({ components }).components;
	})
	components: Array<IoTComponent>;
}

export type JsonKeys =
	| string
	| number
	| boolean
	| null
	| Array<JsonKeys>
	| Array<JsonObj>
	| JsonObj;
export type JsonObj = { [key: string]: JsonKeys };

export type IoTProjectDocument = JsonObj;

export const parseIoTProjectDocument = (doc: IoTProjectDocument) => {
	if (typeof doc !== 'object') {
		return {};
	}

	const getEntriesDeep = (entries: [string, any][]): { [key: string]: any } => {
		const res: { [key: string]: any } = {};

		entries.forEach(entry => {
			const key = entry[0];
			const val = entry[1];

			const parse = (val: any): any => {
				if (isArray(val)) {
					return val.map(v => parse(v));
				} else if (typeof val === 'object') {
					return getEntriesDeep(Object.entries(val));
				} else if (typeof val === 'string') {
					const match = /\/Date\((\d*)\)\//.exec(val);
					if (match) {
						return new Date(+match[1]);
					} else {
						const parsedDate = new Date(val);
						if (
							Object.prototype.toString.call(parsedDate) === '[object Date]' &&
							!isNaN(parsedDate.getTime())
						)
							return parsedDate;
					}
				}
				return val;
			};

			res[key] = parse(val);
		});
		return res;
	};

	return getEntriesDeep(Object.entries(doc));
};

export class IoTProject extends CreatedByUser {
	creator: User;

	@Type(() => IoTProjectLayout)
	layout: IoTProjectLayout;

	// IoTProjectDocument parsing
	@Transform(({ value: doc, type }) => {
		if (type !== TransformationType.PLAIN_TO_CLASS || !doc) {
			return doc;
		}
		return parseIoTProjectDocument(doc);
	})
	document: IoTProjectDocument;

	@Type(() => IoTProject)
	original?: IoTProject;
	originalId?: string;

	@Type(() => ChallengeProgression)
	progression?: ChallengeProgression;

	@Type(() => IoTProjectObject)
	iotProjectObjects?: IoTProjectObject[];

	@Type(() => AsScript)
	scripts: AsScript[] = [];

	access: IOTPROJECT_ACCESS;

	interactRights: IOTPROJECT_INTERACT_RIGHTS;

	collaborators: User[];

	routes: IotRoute[];

	async getRoutes() {
		return await api.db.iot.projects.getRoutes({ id: this.id });
	}

	async getIoTObjects() {
		this.iotProjectObjects = await api.db.iot.projects.getObjects({
			id: this.id,
		});
		return this.iotProjectObjects;
	}

	async getIoTScripts() {
		this.scripts = await api.db.iot.projects.getScripts({
			id: this.id,
		});
		return this.scripts;
	}
}
