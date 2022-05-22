import { validTextColour } from "../functions";
import { Shape } from "../Shape";
import { loadFromTemplate } from './simulationClassUtils';
import { Template } from './typesSimulation';
import { SerializableShape } from './typesSimulation';

type TemplateNamesFigure = 'base';

export class Figure
	extends Shape
	implements SerializableShape<TemplateNamesFigure, Figure>
{
	readonly shapeType = 'Figure';
	readonly templateName: TemplateNamesFigure;

	constructor(s: any, templateName: TemplateNamesFigure, ...points: any[]) {
		super(s, ...points);
		this.class = 'Figure';
		this.templateName = templateName;
		this.loadFromTemplate();
	}

	override click() {
		super.click();
		// key(16) == shift
		if (this.s.editMode && this.s.keyIsDown(16)) {
			const newColor = prompt('Changer couleur pour:');
			if (validTextColour(newColor ?? '')) this.color = newColor ?? this.color;
		}
	}

	get uniqueProperties() {
		return {
			color: this.color,
		};
	}

	loadFromTemplate() {
		loadFromTemplate(this, this.templates, this.templateName);
	}

	readonly defaultTemplate: TemplateNamesFigure = 'base';
	readonly templates: Template<TemplateNamesFigure, Figure> = {
		base: {},
	};
}