import { Shape } from "../Shape"
import { Template } from "./typesSimulation";
import { SerializableShape } from './typesSimulation';
import { Vector } from '../Vector';

type TemplateNamesTerrain = 'slower' | 'slow' | 'base' | 'fast' | 'faster';

export class Terrain
	extends Shape
	implements SerializableShape<TemplateNamesTerrain, Terrain>
{
	readonly shapeType = 'Terrain';
	readonly templateName: TemplateNamesTerrain;

	frictionCoef: number;

	// Classe Terrain concerne tout les "shapes" comme le gazon par exemple.
	constructor(s: any, templateName: TemplateNamesTerrain, ...points: Vector[]) {
		super(s, ...points);
		this.class = 'Terrain';
		this.templateName = templateName;
		this.carInteraction = true;
		this.minimumSize = 75;
		this.loadFromTemplate();
	}

	get uniqueProperties() {
		return {};
	}

	loadFromTemplate() {
		Object.entries(this.templates[this.templateName]).forEach(
			([name, value]) => {
				if (name in this) (this as any)[name] = value;
			},
		);
	}

	readonly defaultTemplate: TemplateNamesTerrain = 'base';
	readonly templates: Template<TemplateNamesTerrain, Terrain> = {
		slower: {
			frictionCoef: 1.08,
		},
		slow: {
			frictionCoef: 1.05,
		},
		base: {
			frictionCoef: 1,
		},
		fast: {
			frictionCoef: 0.95,
		},
		faster: {
			frictionCoef: 0.9,
		},
	};
}
