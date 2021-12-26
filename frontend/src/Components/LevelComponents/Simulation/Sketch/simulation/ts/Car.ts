import { Shape } from '../Shape';
import { SerializableShape, Template } from './typesSimulation';

type TemplateCarType = 'base' | 'physics';

export class Car
	extends Shape
	implements SerializableShape<TemplateCarType, Car>
{
	readonly shapeType = 'Car';
	readonly templateName: TemplateCarType;

	constructor(s: any, templateName: TemplateCarType, ...points: any[]) {
		super(s, ...points);
		this.class = 'Car';
		this.templateName = templateName;
	}

	get uniqueProperties() {
		return {
			color: this.color,
		};
	}

	loadFromTemplate() {
		Object.assign(this, this.templates[this.templateName]);
	}

	readonly defaultTemplate: TemplateCarType = 'base';
	readonly templates: Template<TemplateCarType, Car> = {
		base: {},
		physics: {},
	};
}